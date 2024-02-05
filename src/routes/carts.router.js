import express from "express";
import CartManager from "../dao/db/cartmanager.js";


export const cartsRouter = express.Router();
const manager = new CartManager()



cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await manager.getAllCarts();
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).send("Error interno del servidor");
    }
    
});

cartsRouter.get('/:cid', async (req, res) => {
    await manager.getCarById(req, res);
});




cartsRouter.post('/', async (req, res) => {
    await manager.addCart(req, res);
});


cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    await manager.addProductToCart(req,res);
})



