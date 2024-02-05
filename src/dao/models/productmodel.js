import mongoose from "mongoose";

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
})

export class ProductModel {

    static ProductModel;


    static initialize(){
        this.ProductModel = mongoose.model("products", productSchema)
    }

    static async createProduct(data){
        try{
            const newProduct = new this.ProductModel(data);
            return await newProduct.save();
        }catch(error){
            throw error
        }
    }

    static async findProductByCode(productCode){
        try{
            const product = await this.ProductModel.findOne({code: productCode})
            return product;
        }catch(error){
            throw error;
        }
    } 

    static async getProducts(){
        try{
            const products = await this.ProductModel.find();
            return products;
        }catch(error){
            throw error;
        }
    }

    static async getProductById(id){
        try{
            const product = await this.ProductModel.findById(id);
            return product;
        }catch(error){
            throw error;
        }
    }

    static async updateProduct(id, updateProduct){
        try{
            const update = await this.ProductModel.findByIdAndUpdate(id, updateProduct);
            
            return update;
        }catch(error){
            throw error;
        }
    }

    static async deleteProduct(id){
        try{

            const deleteProduct = await this.ProductModel.findByIdAndDelete(id);

            return deleteProduct;

        }catch(error){
            throw error;
        }
    }

    

}

ProductModel.initialize();