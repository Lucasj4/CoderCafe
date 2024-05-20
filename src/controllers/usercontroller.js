import CartModel from "../models/cartmodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { UserService } from "../services/userservice.js";
import UserDTO from "../dto/user.dto.js";
import { generateResetToken } from "../utils/tokenreset.js";
import { EmailManager } from "./emailmanager.js";

const emailController = new EmailManager();
const userService = new UserService();

export class UserController {


    async register(req, res){
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existingUser = await userService.getUserByEmail(email);
    
            if(existingUser){
                return res.status(409).send("El usuario ya existe");
            }
    
            const newCart = new CartModel();
            await newCart.save();

            const hashedPassword = createHash(password);
          
    
            const newUser = await userService.register({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: hashedPassword,
                age,
            });
    
            await newUser.save();
       
    
            req.logger.info("Usuario creado con éxito");
    
            const token = jwt.sign({ user: newUser }, "coderhouse", {
                expiresIn: "1h"
            });
    
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
    
            res.redirect("/products");
    
        } catch (error) {
            req.logger.error(error);
            res.status(500).send("Ha ocurrido un error interno del servidor.");
        }
    }

    async login(req, res) {

        const { email, password } = req.body;

        try {
            const existingUser = await userService.getUserByEmail(email);


            if (!existingUser) {
                return res.status(401).send("Usuario no válido");
            }
            const validUser = isValidPassword(password, existingUser)

            if (!validUser) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: existingUser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/profile");
        } catch (error) {
            req.logger.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

  

    async profile(req, res) {
        const userDto = new UserDTO(req.user.user.first_name, req.user.user.last_name, req.user.user.rol);
        const isAdmin = req.user.rol === 'Admin' || "Premium";

        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {

        res.clearCookie("coderCookieToken");
        res.status(200).send("User logged out successfully");
        res.redirect("/");
    }

    async admin(req, res) {
        if (req.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }

    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            
            const user = await userService.getUserByEmail( email );
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            const token = generateResetToken();


            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };

            req.logger.info("User resetTOken " + user.resetToken);
            await user.save();
     
            await emailController.sendRestorationEmail(email, user.first_name, token);

            res.redirect("/confirmacion-envio");
        } catch (error) {
            req.logger.error(error);
            console.log(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await userService.getUserByEmail(email)

            if (!user) {
                return res.status(404).render("passwordcambio", { error: "Usuario no encontrado" });
            }

            // Obtener el token de restablecimiento de la contraseña del usuario
            req.logger.info("User" + user);
            const resetToken = user.resetToken;
            req.logger.info("Reset token" + resetToken);
            req.logger.info("Token: " + token);
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.redirect("/passwordcambio");
            }

            // Verificar si la nueva contraseña es igual a la anterior
            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizar la contraseña del usuario
            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            // Renderizar la vista de confirmación de cambio de contraseña
            return res.redirect("/");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    async changeRolPremium(req, res) {
        try {
            const { uid } = req.params;
    
            const user = await userService.getUserById(uid);
            req.logger.info("User: " + user);
    
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            req.logger.info("User rol: " + user.rol);
            const newRol = user.rol === 'User' ? 'Premium' : 'User';
    
            const actualizado = await userService.updateUserRoleById(uid,newRol);
            req.logger.info("User actualizado: " + user);
            const response = {
                message: "User role changed successfully",
                user: actualizado
            };
        
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }






}