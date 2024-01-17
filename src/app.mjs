import express from "express";
import http from 'http';

import socketIo from 'socket.io';
import exphbs from 'express-handlebars';
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});



app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use(express.static("./src/public"));
app.engine("handlebars", exphbs.engine());

app.set("view engine", "handlebars");

app.set("views", "./src/views");


app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);



import {ProductManager} from './controllers/product-manager.js'
const productManager = new ProductManager("./src/models/productos.json");
const io = socketIo(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");


  socket.emit('connected', 'Conexión exitosa');


  socket.emit('updateProducts', await productManager.readFile());
  
  socket.on("Addproduct", async (product) => {
    console.log('Recibido evento "Addproduct" en el servidor');
    console.log('Producto recibido en el servidor:', product);
  
    try {
      await productManager.addProduct(product);
      console.log('Producto agregado exitosamente');
      io.sockets.emit("updateProducts", await productManager.getProducts());
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on("DeleteProduct", async(id)=>{
    try{
      await productManager.deleteProduct(id);
      io.sockets.emit("updateProducts", await productManager.getProducts());

    }catch(error){
      console.error("Error al eliminar producto:", error);
    }
  })

});


export { io };