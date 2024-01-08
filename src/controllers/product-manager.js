const fs = require("fs").promises;

class ProductManager {

    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            this.products = await this.readFile();
            
            ProductManager.ultId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
        } catch (error) {
            console.log("Error al cargar productos:", error);
            this.products = [];
        }
    }
    async addProduct(producto) {
        const { title, description, price, code, stock, category, thumbnails } = producto;

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error("Todos los campos son obligatorios excepto thumbnails");
        }

        if (this.products.some(item => item.code === code)) {
            throw new Error("El código no debe repetirse");
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            code,
            stock,
            status: true,  // Status es true por defecto
            category,
            thumbnails: thumbnails || []  // Si no se proporcionan thumbnails, se establece como un array vacío
        };
        // Leer productos existentes
        const existingProducts = await this.readFile();

        // Agregar el nuevo producto al array existente
        existingProducts.push(newProduct);

        // Guardar el array completo con el nuevo producto
        await this.saveFile(existingProducts);
    }

    async getProducts(limit) {
        try {
            const arrayProductos = await this.readFile();

            if (limit) {
                const limitedProducts = arrayProductos.slice(0, limit);
                return limitedProducts;
            } else {
                return arrayProductos;
            }
        } catch (error) {
            console.log("Error al obtener productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.readFile();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null; // Devuelve null si el producto no se encuentra
            } else {
                return buscado; // Devuelve el producto si se encuentra
            }
        } catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        }



    }

    async readFile() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Error al leer  archivo", error);
        }
    }

    async saveFile(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar  archivo", error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const arrayProductos = await this.readFile();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {

                arrayProductos[index] = { ...arrayProductos[index], ...updatedProduct };

                await this.saveFile(arrayProductos);
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.readFile();

            const updatedProducts = arrayProductos.filter(item => item.id !== id);

            if (updatedProducts.length < arrayProductos.length) {
                await this.saveFile(updatedProducts);
                console.log("Producto eliminado con éxito");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }


}








module.exports = ProductManager;