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
userRouter.post("/logout", userController.logout.bind(userController));
userRouter.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
userRouter.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
userRouter.post("/requestPasswordReset", userController.requestPasswordReset);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.put("/premium/:uid", userController.changeRolPremium)


// userRouter.get("/failedregister", (req, res) => {
//     res.send({ error: "Registro fallido" });
// })

// userRouter.post("/login", userController.login.bind(userController));

// userRouter.get("/current", passportCall("jwt"), authorization("User"), (req, res) => {
//     res.send(req.user)
// })

