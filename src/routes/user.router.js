import express from "express";
import  UserModel  from "../dao/models/user.model.js";
import { createHash } from "../utils/hashBcrypt.js";
export const userRouter = express.Router();
import passport from "passport";

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
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    };
    
    console.log(req.session.user);
    req.session.login = true;

    res.redirect("/products");
})

userRouter.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido"});
})