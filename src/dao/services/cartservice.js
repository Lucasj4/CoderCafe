import CartModel from "../models/cartmodel.js";

export class CartService{
    
    async createCart(cart) {
        try {
            const newCart = new CartModel(cart);
            return await newCart.save();
        } catch(error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            return cart;
        } catch(error) {
            throw error;
        }
    }

    async updateCart(cartId, cart){
        try{
            const newCart = CartModel.findByIdAndUpdate(cartId, cart);
            return newCart;
        }catch{
            throw error;
        }
    }

}