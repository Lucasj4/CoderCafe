const fs = require("fs").promises;

class CartManager {
    static ultId = 0;

    constructor(path) {
        this.carts = [];
        this.path = path;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            this.carts = await this.readFile();
            CartManager.ultId = this.carts.length > 0 ? Math.max(...this.carts.map(cart => cart.id)) : 0;
        } catch (error) {
            console.log("Error al cargar carritos:", error);
            this.carts = [];
        }
    }

    async getAllCarts() {
        try {
            const carts = await this.readFile(this.path, 'utf8');
            return carts;
        } catch (error) {
            console.log("Error al obtener todos los carritos:", error);
            throw error; // Lanza el error para que pueda ser manejado por el llamador si es necesario.
        }
    }

    async getCarById(id) {
        try {
            const cartsArray = await this.readFile();
            const cart = cartsArray.find((cart) => cart.id === id);


            if (!cart) {
                console.log("Cart no encontrado para ID:", id)
                return null;
            } else {

                return cart.products;
            }
        } catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        }
    }
    async addCart() {
        try {
            // Incrementa el último ID y crea un nuevo carrito
            const newCart = {
                id: ++CartManager.ultId,  // Incrementa el ID único
                products:[]
            };

            // Obtiene todos los carritos existentes
            const existingCarts = await this.readFile();

            // Agrega el nuevo carrito al array existente
            existingCarts.push(newCart);

            // Guarda el array actualizado en el archivo
            await this.saveFile(existingCarts);

            // Retorna el nuevo carrito creado
            return newCart;
        } catch (error) {
            console.log("Error al crear un nuevo carrito:", error);
            throw error;  // Lanza el error para que pueda ser manejado por el llamador si es necesario.
        }
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            if (!data.trim()) { // Verifica si el archivo está vacío o solo contiene espacios en blanco.
                return [];
            }
            return JSON.parse(data);

        } catch (error) {
            console.log("Error al leer el archivo:", error);
            return [];
        }
    }

    async saveFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            console.log("Error al guardar en el archivo:", error);
        }
    }
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const products = await this.getCarById(cartId); 
          
            
            const existingProduct = products.find(product => product.product === productId);
    
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                products.push({
                    product: productId,
                    quantity: quantity || 1
                });
            }
    
         
            const carts = await this.readFile();
            const cartToUpdate = carts.find(cart => cart.id === cartId);
            cartToUpdate.products = products;
    
            await this.saveFile(carts);
            
            return cartToUpdate;
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error);
            throw error;
        }
    }
    
}

module.exports = CartManager;