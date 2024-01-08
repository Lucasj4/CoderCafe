const express = require('express');
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js"); 
const manager = new ProductManager("./src/models/productos.json");

router.get('/products', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        const products = await manager.getProducts(limit);
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }

})

router.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try{
     
        const product = await manager.getProductById(productId);
        if (product) {
            res.json(product); // Devuelve el producto si se encuentra
        } else {
            res.status(404).json({ message: 'Producto no encontrado' }); // Devuelve un error si no se encuentra
        }

    }catch(error){
        console.error("Error al obtener el producto por ID", error);
        res.status(500).json({ error: "Error interno del servidor" });

    }


})

router.post('/products', async (req, res) => {
    try {
        const { title, description, price, img, code, stock, category, thumbnails } = req.body;

        const newProduct = {
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            thumbnails
        };

        await manager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        console.error("Error al agregar producto:", error.message);
        res.status(400).json({ error: error.message });
    }
});

router.put('/products/:pid', async(req, res)=>{
    try{
        const productId = parseInt(req.params.pid);

        const product = await manager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

         // Extraer los datos actualizados del cuerpo de la solicitud
         const { title, description, price,  code, stock, category, thumbnails } = req.body;

         // Crear un objeto con los datos actualizados (solo actualizar los campos proporcionados)
         const updatedProduct = {
             id: product.id,  // Mantener el mismo ID
             title: title || product.title,
             description: description || product.description,
             price: price || product.price,
             code: code || product.code,
             stock: stock || product.stock,
             category: category || product.category,
             thumbnails: thumbnails || product.thumbnails
         };

         await manager.updateProduct(productId, updatedProduct);

         res.status(200).json({ message: 'Producto actualizado con éxito', updatedProduct });

    }catch(error){
        console.error("Error al actualizar producto:", error.message);
        res.status(400).json({ error: error.message });
    }

})

router.delete('/products/:pid', async(req,res)=> {
    try{
        const productId = parseInt(req.params.pid);
        await manager.deleteProduct(productId);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    }catch(error){
        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({ error: "Error interno del servidor al eliminar el producto" });
    }
})

module.exports = router;