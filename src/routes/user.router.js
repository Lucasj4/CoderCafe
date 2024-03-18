import express from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash } from "../utils/hashBcrypt.js";
import { passportCall, authorization } from "../utils/util.js";
export const userRouter = express.Router();
import { isValidPassword } from "../utils/hashBcrypt.js";
import passport from "passport";
import jwt from 'jsonwebtoken'; 
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

userRouter.post("/", passport.authenticate("register", {
    failureRedirect: "/register"
}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Credenciales invalidas" });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    };

   
    req.session.login = true;

    res.redirect("/products");
})

userRouter.get("/failedregister", (req, res) => {
    res.send({ error: "Registro fallido" });
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const user = await UserModel.findOne({ email });
        console.log(user.age);
        if (!user) {
            
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isPasswordValid = isValidPassword(password, user);

        if (!isPasswordValid) {

            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ email, role: user.rol }, "coderhouse", { expiresIn: "24h" });

        req.session.user = {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.rol,
            edad: user.age,   
        };
        
        res.cookie("coderCookieToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        res.redirect("/products");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

userRouter.get("/current", passportCall("jwt"), authorization("User"), (req, res) => {
    res.send(req.user)
})