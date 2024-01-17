import  express  from "express";
export const productsRouter = express.Router();

export const viewsRouter = express.Router();

import ProductManager from "../controllers/product-manager.js"; 
const manager = new ProductManager("./src/models/productos.json");

viewsRouter.get('/', async (req, res)=>{
   try{
    const productsData = await manager.readFile();
    console.log(productsData);
    res.render('home', { productsData});
   }catch(error){
    console.error("Error al obtener productos:", error);
    res.status(500).json("Error interno del servidor");
   }
   
    
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
   
   res.render('realTimeProducts');
});