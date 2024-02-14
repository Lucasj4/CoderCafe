import  CartModel from "../models/cartmodel.js";

export default class CartManager{
    constructor() {
        this.cartModel = new CartModel();
    }
    
    async addCart(req, res){
        try{
            const newCart = await this.cartModel.createCart({products: []});
            res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
        }catch(error){
            console.log(`Error: ${error}`);
            res.status(500).json("Error interno del servidor");
        }
    }

    async addProductToCart(req, res) {
        const productId = req.params.pid;  
        const quantity = req.body.quantity || 1;
    
        try {
            const cartId = req.params.cid;
            const cart = await this.cartModel.getCartById(cartId);
    
            if (!cart) {
                res.status(404).json({ message: 'Carrito no encontrado' });
                return;
            }
    
            const productExist = cart.products.find(item => item.product.toString() === productId);
    
            if (productExist) {
                
                productExist.quantity += quantity;
            } else {
                
                cart.products.push({ product: productId, quantity });
            }
    
            cart.markModified("products");
    
            // Guardar el carrito actualizado
            await cart.save();
    
            res.status(200).json({ cart: cart });
        } catch (error) {
            console.log(`Error: ${error}`);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    
    
    

    async getCartById(req, res) {
        const cartId = req.params.cid;
    
        try {
            const cart = await this.cartModel.getCartById(cartId); // 
    
            if (!cart) {
                return { renderView: false, data: res.status(404).json({ message: 'Carrito no encontrado' }) };
            }
    
            return { renderView: true, data: { cart: cart } };
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            return { renderView: false, data: res.status(500).json({ message: 'Error interno del servidor' }) };
        }
    }
    
    async deleteProductToCart(req, res){
        try{
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            const cart = await this.cartModel.getCartById(cartId);
    
            if(!cart){
                res.status(404).json({ message: 'Carrito no encontrado'});
            }
            
    
            const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
           

            
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }
    
         
            cart.products.splice(productIndex, 1);
    
     
            await this.cartModel.updateCart(cartId, cart);
    
            res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
        }catch(error){
            console.error('Error al eliminar el producto del carrito:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
       

    }   

    async deleteAllProductsFromCart(req, res){
        try{
            const cartId = req.params.cid;
    
            const cart = await this.cartModel.getCartById(cartId);
    
            if(!cart){
                return res.status(404).json({ message: 'Carrito no encontrado'});
            }
    
           
            cart.products = [];
    
            await this.cartModel.updateCart(cartId, cart);
    
            return res.status(200).json({ message: 'Todos los productos han sido eliminados del carrito exitosamente' });
        } catch(error){
            console.error('Error al eliminar todos los productos del carrito:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    async updateCart(req, res) {
        const cartId = req.params.cid;
        const newProducts = req.body; 
    
   
        if (!Array.isArray(newProducts) || newProducts.length === 0) {
            return res.status(400).json({ message: 'El cuerpo de la solicitud no contiene datos de productos válidos' });
        }
    
        try {
            const cart = await this.cartModel.getCartById(cartId);
    
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }
    
            console.log(cart.products);
        
            cart.products = newProducts;
            
            console.log(cart.products);
            await this.cartModel.updateCart(cartId, cart);
    
            res.status(200).json({ message: 'Carrito actualizado exitosamente', cart: cart });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    
    
    

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
    
        try {
            const cart = await this.cartModel.getCartById(cartId);
    
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }
    
            const product = cart.products.find(product => product.product.toString() === productId);
    
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }
    
            product.quantity = newQuantity; 
    
            await this.cartModel.updateCart(cartId, cart);
    
            res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente', cart: cart });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}