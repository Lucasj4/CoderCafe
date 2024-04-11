import CartModel from "../models/cartmodel.js";
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { UserService } from "../services/userservice.js";
import UserDTO from "../dto/user.dto.js";

const userService = new UserService();

export class UserController {
    
    
    async register(req, res){
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existingUser = await userService.getUserByEmail(email);

            if(existingUser){
                return res.status(409).send("El usuario ya existe");
            }

        

            
            const newUser = await userService.register({
                first_name,
                last_name,
                email,
                password,
                age,
            });

           if(newUser){
            console.log("creado con exito");
           }

            const token = jwt.sign({ user: newUser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/products");

        } catch (error) {
            console.log(error);
            res.status(500).send("Ha ocurrido un error interno del servidor.");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const existingUser = await userService.getUserByEmail( email );
            
            if (!existingUser){
                return res.status(401).send("Usuario no válido");
            }

            const validUser = isValidPassword(password, existingUser);

            if (!validUser) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: existingUser}, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        const userDto = new UserDTO(req.user.user.first_name, req.user.user.last_name, req.user.user.rol);
        const isAdmin = req.user.rol === 'admin';
        console.log(userDto);
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



    


}