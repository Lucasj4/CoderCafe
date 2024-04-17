import CartModel from "../models/cartmodel.js";

export class CartService {

    async createCart(cart) {
        try {
            const newCart = new CartModel(cart);
            return await newCart.save();
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, cart) {
        try {
            const newCart = CartModel.findByIdAndUpdate(cartId, cart);
            return newCart;
        } catch {
            throw error;
        }
    }

    async getProductsFromCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async AddProduct(cartId, productId, quantity = 1){
        try {
            const cart = await this.getProductsFromCart(cartId);
            const existingProduct = cart.products.find(item => item.product._id.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            //Vamos a marcar la propiedad "products" como modificada antes de guardar: 
            cart.markModified("products");

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async deleteProduct(cartId, productId){
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

}