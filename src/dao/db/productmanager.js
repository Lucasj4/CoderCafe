import { ProductModel } from "../models/productmodel.js";


export default class ProductManager {

    async addProduct(product) {
        const { title, description, price, code, stock, category, thumbnails } = product;
    
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                const missingParameter = !title ? 'title' :
                                         !description ? 'description' :
                                         !price ? 'price' :
                                         !code ? 'code' :
                                         !stock ? 'stock' :
                                         !category ? 'category' : null;
                return { statusCode: 400, body: { error: `Falta el parámetro '${missingParameter}' en la solicitud` } };
            }
    
            const existProduct = await ProductModel.findProductByCode(code);
    
            if (existProduct) {
                return { statusCode: 409, body: { error: "Ya existe un producto con el mismo código" } };
            }
    
            const newProduct = {
                title,
                description,
                price,
                code,
                stock,
                status: true,  
                category,
                thumbnails: thumbnails || []  
            };
    
            await ProductModel.createProduct(newProduct);
            return { statusCode: 201, body: { message: 'Producto agregado con éxito', product: newProduct }};
        } catch (error) {
            return { statusCode: 500, body: { error: 'Error interno del servidor' } };
        }
    }
    

    async getProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const query = req.query.query;
            const filter = query && query.trim() !== '' ? JSON.parse(query) : {};
            const sort = parseInt(req.query.sort) || null;
            const products = await ProductModel.getProducts(limit, page, sort, filter);
            console.log(filter, sort, limit);
        
            return { statusCode: 200, body: { message: 'Productos', product: products }};
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return { statusCode: 500, body: { error: 'Error interno del servidor' } };
        }
    }

    async getProductById(productId) {
        
        try {
            const product = await ProductModel.getProductById(productId);

            return product;

        } catch (error) {
            throw error;
        }
    }




    async updateProduct(productId, productUpdated) {

       
        try {
            await ProductModel.updateProduct(productId, productUpdated);  
            return { statusCode: 200, body: { message: 'Producto actualizado con éxito', product: updatedProduct } };

        } catch (error) {
            console.log("Error al actualizar el producto", error);
            return {statusCode: 500, body: {message: 'Error interno del servidor'}}
        }
        
       
    }

    async deleteProduct(id) {
        try {
            const deleteProductResult = await ProductModel.deleteProduct(id);
    
            if (!deleteProductResult) {
                
                return { success: false, statusCode: 404, message: "Producto no encontrado" };
            }
    
        
            return { success: true, statusCode: 200, message: 'Producto eliminado con éxito' };
        } catch (error) {
            
            console.error("Error al eliminar producto:", error.message);
            return { success: false, statusCode: 500, error: "Error interno del servidor al eliminar el producto" };
        }
    }
    

}

export { ProductManager };