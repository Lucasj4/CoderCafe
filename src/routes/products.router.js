import express from "express";
import ProductController from "../controllers/productmanager.js";
import { generateMockProducts } from "../utils/productsmock.js";
export const productsRouter = express.Router();
import { checkUserRole } from "../middleware/checkrole.js";

import passport from "passport";

const productController = new ProductController();

productsRouter.get('/', productController.getProducts)

productsRouter.get('/:pid', productController.getProductById);

productsRouter.post('/', checkUserRole(["Admin", "Premium"]), passport.authenticate('jwt', { session: false }),productController.addProduct);

productsRouter.put('/:pid', productController.updateProduct);

productsRouter.delete('/:pid', productController.deleteProduct);

productsRouter.get('/mocking/products' , (req, res)=> {
    const products = [];

    for (let index = 0; index < 100; index++) {
        products.push(generateMockProducts());
        
    }
    res.json(products)
})


