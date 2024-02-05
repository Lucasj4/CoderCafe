import { CartModel } from "../models/cartmodel.js";

export default class CartManager{
    
    async addCart(req, res){
        try{
            const newCart = await CartModel.createCart({products: []});
            res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
        }catch(error){
            console.log(`Error: ${error}`);
            res.status(500).json("Error interno del servidor");
        }
    }

    async addProductToCart(req, res) {
        const productId = req.params.pid;  // Corregido para obtener el valor de :pid
        const quantity = req.body.quantity || 1;
    
        try {
            const cartId = req.params.cid;
            const cart = await CartModel.getCartById(cartId);
    
            if (!cart) {
                res.status(404).json({ message: 'Carrito no encontrado' });
                return;
            }
    
            // Buscar el producto en el carrito
            const productExist = cart.products.find(item => item.product.toString() === productId);
    
            if (productExist) {
                // Si el producto ya existe en el carrito, actualizar la cantidad
                productExist.quantity += quantity;
            } else {
                // Si el producto no existe en el carrito, agregarlo
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
    
    
    

    async getCartById(req,res){
        const cartId = req.params.cid;

        const cart = await CartModel.getCartById(cartId);

        if(!cart){
            res.status(404).json({ message: 'Carrito no encontrado'});
            return;
        }
        res.status(200).json({cart: cart})

    }
}