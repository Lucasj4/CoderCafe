const express = require('express');
const router = express.Router();


const CartManager = require("../controllers/cart-manager.js");
const manager = new CartManager("./src/models/carts.json");

router.get('/carts', async (req, res) => {
    try {
        const carts = await manager.getAllCarts();
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/carts/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await manager.getCarById(cartId);

        if (cart) {

            res.json(cart); // Devuelve el producto si se encuentra
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' }); // Devuelve un error si no se encuentra
        }
    } catch (error) {
        console.error("Error al obtener el cart por ID", error);
        res.status(500).json({ error: "Error interno del servidor" });

    }
});


// router.post('/carts', async (req, res) => {
//     try {
//         const products = req.body.products || [];  // Obtiene los productos del cuerpo de la solicitud

//         // Llamada al método addCart pasando los productos
//         const newCart = await manager.addCart(products);

//         // Envía una respuesta 201 indicando que el carrito se ha creado con éxito
//         res.status(200).json({ message: 'Carrito creado con éxito', cart: newCart });
//     } catch (error) {
//         console.error("Error al crear carrito:", error);
//         res.status(400).json({ error: error.message });
//     }
// });

router.post('/carts', async (req, res) => {
    try {
        // Imprime quantify

        const products = req.body;

        // Llamada al método addCart pasando los productos
        const newCart = await manager.addCart(products);

        // Envía una respuesta 201 indicando que el carrito se ha creado con éxito
        res.status(200).json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        console.error("Error al crear carrito:", error);
        res.status(400).json({ error: error.message });
    }
});


router.post('/carts/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantify = parseInt(req.body.quantify);
    try {
        // Llama al método addProductToCart del CartManager
        const updatedCart = await manager.addProductToCart(cartId, productId, quantify);

        res.status(200).json({ message: 'Producto agregado con éxito', cart: updatedCart });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})


module.exports = router;

