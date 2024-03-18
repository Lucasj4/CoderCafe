import express from "express";
import './database.js'
import socketIo from 'socket.io';
import exphbs from 'express-handlebars';
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { ProductManager } from './dao/db/productmanager.js'
import { MessageModel } from './dao/models/messagemodel.js'
import { userRouter } from "./routes/user.router.js";
import { sessionRouter } from "./routes/session.router.js";
import path from 'path';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

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
app.use(cookieParser())
app.use(session({ 
  secret:"secretCoder",
  resave: true, 
  saveUninitialized:true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://lucasfjulia:Lebronjames23@cluster0.k62q89m.mongodb.net/ecommerce?retryWrites=true&w=majority",
    
  })

}))

initializePassport();
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

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
initializePassport();


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