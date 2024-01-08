const express = require("express");
const app = express();
const port = 8080; 


app.use(express.json()); 
//Esto es un Middleware. 
//Acá le digo a express que voy a recibir datos en formato JSON. 

app.use(express.urlencoded( {extended:true}));
//Se encarga de analizar los datos codificados en la URL y los convierte en un objeto Javascript accesible a atraves de req.body. 

const cartsRouter = require("./routes/carts.router"); 
const productsRouter = require("./routes/products.router");

app.use("/api/", cartsRouter); 
app.use("/api/", productsRouter);



app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
  });