import mongoose from "mongoose";
import { configObject } from "./config/config.js";




const {mongo_url} = configObject;

// app.listen(puerto, () => {
//     console.log(`Servidor en ejecución en http://localhost:${puerto}`);
//   });

mongoose.connect(mongo_url)
    .then(()=> { console.log("Conexion exitosa")})
    .catch((error)=> console.log(`Error: ${error}`));