import CartModel from "../models/cartmodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { UserService } from "../services/userservice.js";
import UserDTO from "../dto/user.dto.js";
import { generateResetToken } from "../utils/tokenreset.js";
import { EmailManager } from "./emailmanager.js";
import { configObject } from "../config/config.js";
const {adminEmail, adminPassword} = configObject;
const emailController = new EmailManager();
const userService = new UserService();

export class UserController {

    async getUsers(req, res) {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
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

            let role = "User"
            if(email === adminEmail && password === adminPassword ){
                console.log("email: ", email);
                console.log("email variable: ", adminEmail);
                console.log("Contrase;a: ", password);
                console.log("Contrase;a variable de entorno: ", adminPassword);
                role = "Admin";
            }
    
            const newUser = await userService.register({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: hashedPassword,
                age,
                rol: role
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
    async getIdUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send('Usuario no autenticado');
            }
    
            const userId = req.user._id; // Obtener el ID del usuario autenticado
         
            res.status(200).json({ userId });
        } catch (error) {
            console.error('Error al obtener ID de usuario:', error);
            res.status(500).send('Error interno del servidor');
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
        const userDto = new UserDTO(req.user.user.first_name, req.user.user.last_name, req.user.user.rol, req.user.user.email);
        const isAdmin = req.user.rol === 'Admin' || "Premium";

        res.render("profile", { user: userDto, isAdmin });
    }

    
    async logout(req, res) {

        res.clearCookie("coderCookieToken");
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
         
         
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userDocuments = user.documents.map(doc => doc.name)

            const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!hasRequiredDocuments) {
                return res.status(400).json({ message: 'El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta' });
            }

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

    async uploadDocuments(req, res) {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
        const user = await userService.getUserById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Mapear los nombres según el tipo de documento
        const documentTypes = {
            document: "Identificación",
            products: "Comprobante de domicilio",
            profile: "Comprobante de estado de cuenta"
        };

        // Verificar si se subieron documentos y actualizar el usuario
        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: documentTypes.document,
                    reference: doc.path
                })));
            }
            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: documentTypes.products,
                    reference: doc.path
                })));
            }
            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: documentTypes.profile,
                    reference: doc.path
                })));
            }
        }

        // Guardar los cambios en la base de datos
        await user.save();

        res.status(200).send("Documentos subidos exitosamente");
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send('Error interno del servidor');
    }
}
    async deleteInactiveUsers(req, res, minutes = 2880) { // Usar 30 minutos para pruebas 2880
        try {
            const inactiveUsers = await userService.getInactiveUsers(minutes);
            const deletedUsers = [];
          

            if(inactiveUsers){
                for (const user of inactiveUsers) {
                    await emailController.sendDeletionEmail(user.email, user.first_name);
                    await userService.deleteUserById(user._id);
                    deletedUsers.push(user)
                }
    
                console.log(`Eliminados ${inactiveUsers.length} usuarios por inactividad`);
                res.status(200).json({
                    message: `Eliminados ${deletedUsers.length} usuarios por inactividad`,
                    deletedUsers: deletedUsers
                });
            }else{
                res.status(200).json({
                    message: "No hay usuarios inactivos"
                });
            }
        
        } catch (error) {
            console.error("Error interno del servidor:", error);
        }
    }
}