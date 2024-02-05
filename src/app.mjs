import express from "express";
import http from 'http';
import './database.js'
import socketIo from 'socket.io';
import exphbs from 'express-handlebars';
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { ProductManager } from './dao/db/productmanager.js'
import { MessageModel } from './dao/models/messagemodel.js'
import path from 'path';


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


const hbs = exphbs.create({
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");



app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

app.get('*.mjs', (req, res, next) => {
  res.type('application/javascript');
  next();
});


const productManager = new ProductManager();
const io = socketIo(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");


  socket.emit('connected', 'Conexión exitosa');


  socket.emit('updateProducts', await productManager.getProducts());

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

  socket.on("DeleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(id);
      io.sockets.emit("updateProducts", await productManager.getProducts());

    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  })


  socket.on("message", async data => {
    try {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        io.sockets.emit("message", messages);
    } catch (error) {
        console.error("Error al guardar o recuperar mensajes:", error);
    }
});


});


export { io };