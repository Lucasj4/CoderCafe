import express from "express";
import  UserModel  from "../dao/models/user.model.js";

export const userRouter = express.Router();


userRouter.post('/', async(req, res)=>{
    const {first_name, last_name, email, password, age, rol} = req.body; 
    

    try {
        await UserModel.create({first_name, last_name, email, password, age, rol:"user"});

        res.status(200).send({message: "Usuario creado con éxito"});

    } catch (error) {
        console.log(error)
        res.status(400).send({error: "Error al crear el usuario"});
    }
})