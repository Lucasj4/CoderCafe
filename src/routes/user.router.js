import express from "express";
import UserModel from "../models/user.model.js";
import { createHash } from "../utils/hashBcrypt.js";
import { passportCall, authorization } from "../utils/util.js";
import {UserController} from '../controllers/usercontroller.js'
export const userRouter = express.Router();
import { isValidPassword } from "../utils/hashBcrypt.js";
import passport from "passport";
import jwt from 'jsonwebtoken'; 

const userController = new UserController();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
userRouter.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);


// userRouter.post('/', async(req, res)=>{
//     const {first_name, last_name, email, password, age, rol} = req.body; 


//     try {
//         const existingUser = await UserModel.findOne({ email: email });
//         if (existingUser) {
//             return res.status(400).send({ error: "El correo electrónico ya está registrado" });
//         }
//         const newUser = await UserModel.create({first_name, last_name, email, password:createHash(password), age, rol:"user"});

//         req.session.login = true;

//         req.session.user = { ...newUser._doc };

//         res.status(200).send({message: "Usuario creado con éxito"});

//     } catch (error) {
//         console.log(error)
//         res.status(400).send({error: "Error al crear el usuario"});
//     }
// })

// userRouter.post("/", passport.authenticate("register", {
//     failureRedirect: "/register"
// }), async (req, res) => {
//     if (!req.user) return res.status(400).send({ status: "error", message: "Credenciales invalidas" });

//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email,
//         rol: req.user.rol
//     };

   
//     req.session.login = true;

//     res.redirect("/products");
// })

// userRouter.get("/failedregister", (req, res) => {
//     res.send({ error: "Registro fallido" });
// })

// userRouter.post("/login", userController.login.bind(userController));

// userRouter.get("/current", passportCall("jwt"), authorization("User"), (req, res) => {
//     res.send(req.user)
// })

