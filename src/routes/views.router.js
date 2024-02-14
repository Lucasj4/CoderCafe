import  express  from "express";
export const productsRouter = express.Router();

export const viewsRouter = express.Router();
import CartManager from "../dao/db/cartmanager.js";
import ProductManager from "../dao/db/productmanager.js"; 
import { rest } from "underscore";

const manager = new ProductManager();
const CartManagerInstance = new CartManager();
viewsRouter.get('/products', async (req, res)=>{
   try{
    const productsData = await manager.getProducts(req, res);
   
    const products = productsData.body.product.docs.map(product => {
      const {_id, ...rest} = product.toObject();
      return rest;
    })
    res.render('products', {  products: products,
      hasPrevPage: productsData.body.product.hasPrevPage,
      hasNextPage: productsData.body.product.hasNextPage,
      prevPage: productsData.body.product.prevPage, 
      nextPage: productsData.body.product.nextPage,
      currentPage: productsData.body.product.page,
      totalPages: productsData.body.product.totalPages,
      limit: req.query.limit || 10, // Usa el límite actual o el predeterminado
      query: req.query.query, // Mantén otros parámetros de consulta
      sort: req.query.sort});
   }catch(error){
    console.error("Error al obtener productos:", error);
    res.status(500).json("Error interno del servidor");
   }
   
    
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
   
   res.render('realTimeProducts');
});

viewsRouter.get('/carts/:cid', async (req, res) => {
   try {

       const result = await CartManagerInstance.getCartById(req, res);

       if (!result.renderView) {
           
           return result.data;
       }


       res.render('carts', result.data);
   } catch (error) {
       console.error('Error al obtener el carrito:', error);
       res.status(500).json({ message: 'Error interno del servidor' });
   }
});

