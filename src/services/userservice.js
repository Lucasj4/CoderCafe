import UserModel from "../models/user.model.js";
import CartModel from "../models/cartmodel.js";
import { createHash } from "../utils/hashBcrypt.js";

export class UserService{

    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {  
            throw new Error(error);
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {  
            throw new Error(error);
        }
    }

    async updateUserRoleById(userId, newRole)  {
        try {
         
            const updatedUser = await UserModel.findByIdAndUpdate(userId, { rol: newRole }, { new: true });
            
            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }
    
         
            return updatedUser;
        } catch (error) {
            throw new Error('Error al actualizar el rol del usuario: ' + error.message);
        }
    }

    async register(data){
        const { first_name, last_name, email, password, age } = data;
        try {
            const newCart = new CartModel();
            await newCart.save();

            // Crear un nuevo usuario con los datos proporcionados
            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password,
                age
            });

            await newUser.save();
            return newUser;

        } catch (error) {
            throw error;
        }
    }
}