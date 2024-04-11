import express from "express";
import ProductController from "../controllers/productmanager.js";

export const productsRouter = express.Router();

const productController = new ProductController();

productsRouter.get('/', productController.getProducts)

productsRouter.get('/:pid', productController.getProductById);

productsRouter.post('/', productController.addProduct);

productsRouter.put('/:pid', productController.updateProduct);

productsRouter.delete('/:pid', productController.deleteProduct);


