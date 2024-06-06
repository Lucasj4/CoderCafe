import express from "express";
import {UserController} from '../controllers/usercontroller.js'
import passport from "passport";
import { upload } from "../middleware/multer.js";
export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout.bind(userController));
userRouter.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
userRouter.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
userRouter.post("/requestPasswordReset", userController.requestPasswordReset);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.put("/premium/:uid", userController.changeRolPremium);
userRouter.post('/:uid/documents', upload.fields([
    { name: 'document' }, { name: 'products' }, { name: 'profile' }
]), userController.uploadDocuments);


