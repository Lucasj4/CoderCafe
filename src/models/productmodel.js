import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    img: {
        type: String, 
    },
    code: {
        type: String, 
        required: true,
        unique: true
    },
    stock: {
        type: Number, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    status: {
        type: Boolean, 
        required: true
    },
    thumbnails: {
        type: [String], 
    },
});

// Aplicar el plugin de paginación a nuestro esquema
productSchema.plugin(mongoosePaginate);

// Definir el modelo de producto
const ProductModel = mongoose.model("products", productSchema);

// Exportar el modelo de producto
export default ProductModel;


