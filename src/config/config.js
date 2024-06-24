import dotenv from 'dotenv';
import { program } from '../utils/commander.js';

const { mode } = program.opts();

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

export const configObject = {
    puerto: process.env.PORT || 8080, // Si PUERTO no está definido en .env, usa 8080 como valor por defecto
    mongo_url: process.env.MONGO_URL || "mongodb+srv://lucasfjulia:Lebronjames23@cluster0.k62q89m.mongodb.net/ecommerce?retryWrites=true&w=majority",
    node_env: process.env.NODE_ENV,
    adminEmail: process.env.ADMIN_EMAIL, // Acceder a la variable ADMIN_EMAIL
    adminPassword: process.env.ADMIN_PASSWORD // Acceder a la variable ADMIN_PASSWORD
};



