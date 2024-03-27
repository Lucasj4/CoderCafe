import  ProductModel  from "../models/productmodel.js";

export class ProductService{

    async createProduct(data){
        try{
            const newProduct = new ProductModel(data);
            return await newProduct.save();
        }catch(error){
            throw error
        }
    }

    async findProductByCode(productCode){
        try{
            const product = await ProductModel.findOne({code: productCode})
            return product;
        }catch(error){
            throw error;
        }
    } 

    async getProducts(limit, page, sort, filter){
        try {
            let options = { limit, page };
            
            
            if (sort) {
                options.sort = { price: sort };
            }
    
            const products = await ProductModel.paginate(filter, options);
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id){
        try{
            const product = await ProductModel.findById(id);
            return product;
        }catch(error){
            throw error;
        }
    }

    async updateProduct(id, updateProduct){
        try{
            const update = await ProductModel.findByIdAndUpdate(id, updateProduct);
            
            return update;
        }catch(error){
            throw error;
        }
    }

    async deleteProduct(id){
        try{

            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            
            return deleteProduct;

        }catch(error){
            throw error;
        }
    }

}