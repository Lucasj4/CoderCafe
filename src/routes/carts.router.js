import express from "express";
import CartController from '../controllers/cartmanager.js';
import { authMiddleware } from "../middleware/authmiddleware.js";
export const cartsRouter = express.Router();
const cartController = new CartController();

cartsRouter.use(authMiddleware);

cartsRouter.get('/:cid', cartController.getCartById);
cartsRouter.delete('/:cid/products/:pid',cartController.deleteProductToCart); 
cartsRouter.delete('/:cid', cartController.deleteAllProductsFromCart);
cartsRouter.post('/', cartController.addCart);
cartsRouter.post('/:cid/product/:pid', cartController.addProductToCart)
cartsRouter.put('/:cid',cartController.updateCart);
cartsRouter.put('/:cid/products/:pid',cartController.updateProductQuantity);
cartsRouter.post('/:cid/purchase', cartController.finishPurchase)