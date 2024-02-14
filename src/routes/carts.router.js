import express from "express";
import CartManager from "../dao/db/cartmanager.js";


export const cartsRouter = express.Router();
const manager = new CartManager()





cartsRouter.get('/:cid', async (req, res) => {
    await manager.getCartById(req, res);
});

cartsRouter.delete('/:cid/products/:pid', async(req, res) => {
    await manager.deleteProductToCart(req, res);
}); 
cartsRouter.delete('/:cid', async (req, res)=> {
    await manager.deleteAllProductsFromCart(req, res);
});
cartsRouter.post('/', async (req, res) => {
    await manager.addCart(req, res);
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    await manager.addProductToCart(req,res);
})


cartsRouter.put('/:cid', async (req, res) => {
    await manager.updateCart(req, res);
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    await manager.updateProductQuantity(req, res);
});


