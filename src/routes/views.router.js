import  express  from "express";
export const productsRouter = express.Router();
import {ViewController}  from "../controllers/viewscontroller.js";
export const viewsRouter = express.Router();
import CartController from "../controllers/cartmanager.js";
import ProductController from "../controllers/productmanager.js"; 
import {checkUserRole} from '../middleware/checkrole.js'
import passport from "passport";
const viewController = new ViewController();
import { authMiddleware } from "../middleware/authmiddleware.js";

const CartManagerInstance  = new CartController();
const manager = new ProductController();



viewsRouter.get("/products", viewController.renderProducts);

viewsRouter.get('/realtimeproducts',checkUserRole(['User']),viewController.renderRealTimeProducts);

viewsRouter.get('/carts/:cid', viewController.renderCart);

viewsRouter.get("/register", viewController.renderRegister);

viewsRouter.get("/profile", viewController.renderProfile);

viewsRouter.get("/", viewController.renderLogin);

viewsRouter.get('/chat', checkUserRole(['User']), viewController.renderChat)

viewsRouter.get("/reset-password", viewController.renderResetPassword);

viewsRouter.get("/password", viewController.renderChangePassword);

viewsRouter.get("/confirmacion-envio", viewController.renderConfirmation );

viewsRouter.get("/agregarproducto", checkUserRole(['Premium','Admin']),viewController.renderAddProduct);

viewsRouter.get("/uploaddocuments", viewController.renderUploadDocuments)



