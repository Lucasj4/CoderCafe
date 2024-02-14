import  express  from "express";
export const productsRouter = express.Router();

import {ProductManager} from "../dao/db/productmanager.js"; 
const manager = new ProductManager();

productsRouter.get('/', async (req, res) => {
    const limit = req.query.limit;
    try{
        const products = await manager.getProducts(req, res);
      
        res.json(products);
        
    }catch(error){
        res.status(result.statusCode).json(result.body);
    }

    
})

productsRouter.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
  
    try {
      const product = await manager.getProductById(productId);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  productsRouter.post('/', async (req, res) => {
    const product = req.body;

    try {
        const result = await manager.addProduct(product);
        res.status(result.statusCode).json(result.body);
        ;
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


productsRouter.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    try {
        const result = await manager.updateProduct(productId, updatedProduct);
        res.status(result.statusCode).json(result.body);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const id = req.params.pid;
    const result = await manager.deleteProduct(id);

    // Configurar la respuesta según el resultado
    res.status(result.statusCode).json(result);
});


