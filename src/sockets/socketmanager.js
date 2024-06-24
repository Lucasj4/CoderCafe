import { Server } from "socket.io";
import { ProductService } from "../services/productservice.js";
import { MessageModel } from "../models/messagemodel.js";
const productService = new ProductService(); 

export class SocketManager {
    constructor(httpServer) {
        this.io = new Server(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("products", await productService.getProducts());

            socket.on("deleteProduct", async (id) => {
                await productService.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (product) => {
                await productService.createProduct(product);
                console.log(product);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productService.getProducts());
    }
}
