import express from "express";
import './database.js'
// import socketIo from 'socket.io';
import exphbs from 'express-handlebars';
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { userRouter } from "./routes/user.router.js";
import { sessionRouter } from "./routes/session.router.js";
import path from 'path';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { generateMockProducts } from "./utils/productsmock.js";
import errorHandler from "./middleware/error.js";
import { authMiddleware } from "./middleware/authmiddleware.js";
import { addLogger } from "./utils/logger.js";
import flash from 'connect-flash'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express";
import methodOverride from 'method-override'
const app = express();
app.use(addLogger);


const PORT = 8080;
const httpServer = app.listen(PORT, (req, res) => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser())
app.use(session({
  secret: "secretCoder",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://lucasfjulia:Lebronjames23@cluster0.k62q89m.mongodb.net/ecommercetest?retryWrites=true&w=majority",

  })

}))
const hbs = exphbs.create({
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.use(flash())

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(authMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use(errorHandler);

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});
initializePassport();


app.get("/loggertest", (req, res) => {
  req.logger.error("Error fatal");
  req.logger.debug("Mensaje de debug");
  req.logger.info("Mensaje de Info");
  req.logger.warning("Mensaje de Warning");

  res.send("Test de logs");
})
app.get('/mockingproducts', (req, res) => {
  const products = [];

  for (let index = 0; index < 100; index++) {
    products.push(generateMockProducts());

  }
  res.json(products)
})


app.get('*.mjs', (req, res, next) => {
  res.type('application/javascript');
  next();
});

const swaggerOptions = {
  definition: {
      openapi: "3.0.1",
      info: {
          title: "Documentacion de la App CoderCafe",
          description: "App dedicada a la venta de cafe"
      }
  },
  apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
// const productManager = new ProductController();
// const io = socketIo(httpServer);

// io.on("connection", async (socket) => {
//   console.log("Un cliente se conectó");


//   socket.emit('connected', 'Conexión exitosa');


//   socket.emit('updateProducts', await productManager.getProducts());

//   socket.on("Addproduct", async (product) => {
//     console.log('Recibido evento "Addproduct" en el servidor');
//     console.log('Producto recibido en el servidor:', product);

//     try {
//       await productManager.addProduct(product);
//       console.log('Producto agregado exitosamente');
//       io.sockets.emit("updateProducts", await productManager.getProducts());
//     } catch (error) {
//       console.error("Error al agregar producto:", error);
//     }
//   });

//   socket.on("DeleteProduct", async (id) => {
//     try {
//       await productManager.deleteProduct(id);
//       io.sockets.emit("updateProducts", await productManager.getProducts());

//     } catch (error) {
//       console.error("Error al eliminar producto:", error);
//     }
//   })


//   socket.on("message", async data => {
//     try {
//         await MessageModel.create(data);
//         const messages = await MessageModel.find();
//         io.sockets.emit("message", messages);
//     } catch (error) {
//         console.error("Error al guardar o recuperar mensajes:", error);
//     }
// });


// });


// export { io };