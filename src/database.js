import mongoose from "mongoose";


mongoose.connect("mongodb+srv://lucasfjulia:Lebronjames23@cluster0.k62q89m.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(()=> { console.log("Conexion exitosa")})
    .catch((error)=> console.log(`Error: ${error}`));