import express from "express";

import passport from "passport";
export const sessionRouter = express.Router();

// sessionRouter.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await UserModel.findOne({ email: email });
//         if (user) {
//             // if (user.password === password)
//             req.session.login = true;
//             if(isValidPassword(password, user)){
//                 if(user.email === "adminCoder@coder.com" && user.password === "adminCod3r123"){
//                     req.session.user = {
//                         email: user.email,
//                         age: user.age,
//                         first_name: user.first_name,
//                         last_name: user.last_name,
//                         rol: "admin",

//                     };
                    
//                 }else{
//                     req.session.user = {
//                         email: user.email,
//                         age: user.age,
//                         first_name: user.first_name,
//                         last_name: user.last_name,
//                         rol: user.rol,
//                     };
//                 }
                
                

//                 res.redirect("/products");
//             }else {
//                 res.status(401).send({ error: "Contraseña no valida" });
//             }
//         } else {
//             res.status(404).send({ error: "Usuario no encontrado" });
//         }

//     } catch (error) {
//         console.log(error)
//         res.status(400).send({ error: "Error en el login" });
//     }
// })

// sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: 'api/sessions/faillogin'}), async(req, res)=>{
//     if(!req.user) return res.status(400).send({status: "error", message:"Credenciales Invalidas"});

//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email
//     };

//     req.session.login = true;

//     res.redirect("/products");
// })



// sessionRouter.get('/faillogin', async(req,res)=>{
//     console.log("Fallo la estrategia");
//     res.send({error: "fallo login"});
// })
// sessionRouter.get("/logout", (req, res) => {
//     if (req.session.login) {
//         req.session.destroy();
//     }
//     res.redirect("/");
// })

// sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res)=> {
// })

// sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req,res)=> {
//     req.session.user = req.user;
//     req.session.login = true;
//     res.redirect('/products');
// })