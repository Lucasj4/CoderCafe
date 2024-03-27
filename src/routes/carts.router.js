import express from "express";
import CartController from "../dao/db/cartmanager.js";

export const cartsRouter = express.Router();
const cartController = new CartController();

cartsRouter.get('/:cid', cartController.getCartById);

cartsRouter.delete('/:cid/products/:pid',cartController.deleteProductToCart); 

cartsRouter.delete('/:cid', cartController.deleteAllProductsFromCart);

cartsRouter.post('/', cartController.addCart);

cartsRouter.post('/:cid/product/:pid', cartController.addProductToCart)

cartsRouter.put('/:cid',cartController.updateCart);

cartsRouter.put('/:cid/products/:pid',cartController.updateProductQuantity);