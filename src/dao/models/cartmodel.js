import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'products',
                required: true
            },
            quantity: {
                type: Number, 
                required: true
            }
        }
    ]
});

cartSchema.pre("findOne", function(next){
    this.populate("products.product");
    next();
})

export default class CartModel {

    constructor() {
        this.CartModel = mongoose.model("carts", cartSchema);
    }

    async createCart(cart) {
        try {
            const newCart = new this.CartModel(cart);
            return await newCart.save();
        } catch(error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.CartModel.findById(id);
            return cart;
        } catch(error) {
            throw error;
        }
    }

    async updateCart(cartId, cart){
        try{
            const newCart = this.CartModel.findByIdAndUpdate(cartId, cart);
            return newCart;
        }catch{
            throw error;
        }
    }
}
