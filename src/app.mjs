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
import { SocketManager } from "./sockets/socketmanager.js";
import { configObject } from "./config/config.js";
import { mongo } from "mongoose";

const { mongo_url} = configObject
const app = express();
app.use(addLogger);


const PORT = process.env.PORT||8080;

const httpServer = app.listen(PORT,"0.0.0.0",(req, res) => {
  console.log(`Servidor en ejecución en ${PORT}`);
});
new SocketManager(httpServer)
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
    mongoUrl: mongo_url,

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
