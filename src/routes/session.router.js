import express from "express";
import UserModel from "../dao/models/user.model.js";
export const sessionRouter = express.Router();

sessionRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            //uso isValidPassword para verificar el pass: 
            req.session.login = true;
            if (user.password === password) {
                if(user.email = "adminCoder@coder.com"){
                    req.session.user = {
                        email: user.email,
                        age: user.age,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        rol: "admin"
                    };
                }else{
                    req.session.user = {
                        email: user.email,
                        age: user.age,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        rol: user.rol,
                    };
                }
                
                

                res.redirect("/products");
            }else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Error en el login" });
    }
})