import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },

    last_name : {
        type: String, 
        //required: true
    },

    email : {
        index: true, 
        required: true,
        type: String, 
        unique: true
    }, 

    password: {
        type: String, 
        //required: true
    },

    age : {
        type: Number, 
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    rol:{
        type: String,
        enum: ['Admin', 'User', 'Premium'],
        default: 'User'
    },
    resetToken: {
        token: String,
        expiresAt: Date
    }
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;