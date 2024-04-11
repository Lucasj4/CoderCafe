import  express  from "express";
export const productsRouter = express.Router();
import {ViewController}  from "../controllers/viewscontroller.js";
export const viewsRouter = express.Router();
import CartController from "../controllers/cartmanager.js";
import ProductController from "../controllers/productmanager.js"; 
import {checkUserRole} from '../middleware/checkrole.js'
import passport from "passport";
const viewController = new ViewController();

const CartManagerInstance  = new CartController();
const manager = new ProductController();

viewsRouter.get("/products",checkUserRole(['User']),passport.authenticate('jwt', { session: false }), viewController.renderProducts);

viewsRouter.get('/realtimeproducts',viewController.renderRealTimeProducts);

viewsRouter.get('/carts/:cid', viewController.renderCart);

viewsRouter.get("/register", viewController.renderRegister);

viewsRouter.get("/", viewController.renderLogin);

