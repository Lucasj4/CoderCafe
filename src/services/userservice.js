import UserModel from "../models/user.model.js";
import CartModel from "../models/cartmodel.js";
import { createHash } from "../utils/hashBcrypt.js";
import UserDTO from "../dto/user.dto.js";
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

    async getUsers(){
        try {
            const users = await UserModel.find();
            return users.map(user => new UserDTO(user.first_name, user.last_name, user.email, user.rol));
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

    async getInactiveUsers(minutes = 2880) {
        try {
            // Calcular la fecha límite
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();

    
            const dateThreshold = new Date(year, month, day, hours, minutes - minutes);
          
            // Realizar la consulta a la base de datos utilizando el método find de Mongoose
            const inactiveUsers = await UserModel.find({ last_connection: { $lt: dateThreshold } });
            
            // Devolver el resultado de la consulta
            return inactiveUsers;
        } catch (error) {
            // Manejar cualquier error que pueda ocurrir durante la consulta
            console.error("Error al obtener usuarios inactivos:", error);
            throw error;
        }
    }

    async deleteUserById(userId) {
        return await UserModel.findByIdAndDelete(userId);
    }
}