import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required: true
            },
            quantity: {
                type: Number, 
                required: true
            }
        }
    ]
})

export class CartModel {
    
    static CartModel
    
    static inizialite(){
        this.CartModel = mongoose.model("carts", cartSchema)
    }

    static async createCart(cart){
        try{
            const newCart = new this.CartModel(cart);
            return await newCart.save()
        }catch(error){
            throw error;
        }
        
    }

    static async getCartById(id){
        try{
            const cart = await this.CartModel.findById(id);
            return cart;
        }catch(error){
            throw error;
        }
    }

    
}

CartModel.inizialite();

