import dotenv from 'dotenv';
import { program } from '../utils/commander.js';

const { mode } = program.opts();

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

export const configObject = {
    puerto: process.env.PUERTO || 8080, // Si PUERTO no está definido en .env, usa 8080 como valor por defecto
    mongo_url: process.env.MONGO_URL || "mongodb+srv://lucasfjulia:Lebronjames23@cluster0.k62q89m.mongodb.net/ecommerce?retryWrites=true&w=majority"
};


