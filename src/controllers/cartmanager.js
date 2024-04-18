import { CartService } from "../services/cartservice.js";
import UserModel from '../models/user.model.js';
import {ProductService} from '../services/productservice.js';
import TicketModel from "../models/ticketmodel.js";
import { generateUniqueCode, calculateTotal } from "../utils/cartutils.js";

const cartService = new CartService();
const productService = new ProductService();

export default class CartController {
    // constructor() {
    //     this.cartModel = new CartModel();
    // }

    // async addCart(req, res){
    //     try{
    //         const newCart = await this.cartModel.createCart({products: []});
    //         res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    //     }catch(error){
    //         console.log(`Error: ${error}`);
    //         res.status(500).json("Error interno del servidor");
    //     }
    // }

    // async addProductToCart(req, res) {
    //     const productId = req.params.pid;  
    //     const quantity = req.body.quantity || 1;

    //     try {
    //         const cartId = req.params.cid;
    //         const cart = await this.cartModel.getCartById(cartId);

    //         if (!cart) {
    //             res.status(404).json({ message: 'Carrito no encontrado' });
    //             return;
    //         }

    //         const productExist = cart.products.find(item => item.product.toString() === productId);

    //         if (productExist) {

    //             productExist.quantity += quantity;
    //         } else {

    //             cart.products.push({ product: productId, quantity });
    //         }

    //         cart.markModified("products");

    //         // Guardar el carrito actualizado
    //         await cart.save();

    //         res.status(200).json({ cart: cart });
    //     } catch (error) {
    //         console.log(`Error: ${error}`);
    //         res.status(500).json({ error: "Error interno del servidor" });
    //     }
    // }




    // async getCartById(req, res) {
    //     const cartId = req.params.cid;

    //     try {
    //         const cart = await this.cartModel.getCartById(cartId); // 

    //         if (!cart) {
    //             return { renderView: false, data: res.status(404).json({ message: 'Carrito no encontrado' }) };
    //         }

    //         return { renderView: true, data: { cart: cart } };
    //     } catch (error) {
    //         console.error('Error al obtener el carrito:', error);
    //         return { renderView: false, data: res.status(500).json({ message: 'Error interno del servidor' }) };
    //     }
    // }

    // async deleteProductToCart(req, res){
    //     try{
    //         const cartId = req.params.cid;
    //         const productId = req.params.pid;

    //         const cart = await this.cartModel.getCartById(cartId);

    //         if(!cart){
    //             res.status(404).json({ message: 'Carrito no encontrado'});
    //         }


    //         const productIndex = cart.products.findIndex(product => product.product.toString() === productId);



    //         if (productIndex === -1) {
    //             return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    //         }


    //         cart.products.splice(productIndex, 1);


    //         await this.cartModel.updateCart(cartId, cart);

    //         res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
    //     }catch(error){
    //         console.error('Error al eliminar el producto del carrito:', error);
    //         res.status(500).json({ message: 'Error interno del servidor' });
    //     }


    // }   

    // async deleteAllProductsFromCart(req, res){
    //     try{
    //         const cartId = req.params.cid;

    //         const cart = await this.cartModel.getCartById(cartId);

    //         if(!cart){
    //             return res.status(404).json({ message: 'Carrito no encontrado'});
    //         }


    //         cart.products = [];

    //         await this.cartModel.updateCart(cartId, cart);

    //         return res.status(200).json({ message: 'Todos los productos han sido eliminados del carrito exitosamente' });
    //     } catch(error){
    //         console.error('Error al eliminar todos los productos del carrito:', error);
    //         return res.status(500).json({ message: 'Error interno del servidor' });
    //     }
    // }
    // async updateCart(req, res) {
    //     const cartId = req.params.cid;
    //     const newProducts = req.body; 


    //     if (!Array.isArray(newProducts) || newProducts.length === 0) {
    //         return res.status(400).json({ message: 'El cuerpo de la solicitud no contiene datos de productos válidos' });
    //     }

    //     try {
    //         const cart = await this.cartModel.getCartById(cartId);

    //         if (!cart) {
    //             return res.status(404).json({ message: 'Carrito no encontrado' });
    //         }

    //         console.log(cart.products);

    //         cart.products = newProducts;

    //         console.log(cart.products);
    //         await this.cartModel.updateCart(cartId, cart);

    //         res.status(200).json({ message: 'Carrito actualizado exitosamente', cart: cart });
    //     } catch (error) {
    //         console.error('Error al actualizar el carrito:', error);
    //         res.status(500).json({ message: 'Error interno del servidor' });
    //     }
    // }




    // async updateProductQuantity(req, res) {
    //     const cartId = req.params.cid;
    //     const productId = req.params.pid;
    //     const newQuantity = req.body.quantity;

    //     try {
    //         const cart = await this.cartModel.getCartById(cartId);

    //         if (!cart) {
    //             return res.status(404).json({ message: 'Carrito no encontrado' });
    //         }

    //         const product = cart.products.find(product => product.product.toString() === productId);

    //         if (!product) {
    //             return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    //         }

    //         product.quantity = newQuantity; 

    //         await this.cartModel.updateCart(cartId, cart);

    //         res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente', cart: cart });
    //     } catch (error) {
    //         console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    //         res.status(500).json({ message: 'Error interno del servidor' });
    //     }
    // }

    async addCart(req, res) {
        try {
            const newCart = await cartService.createCart({ products: [] });
            res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
        } catch (error) {
            console.log(`Error: ${error}`);
            res.status(500).json("Error interno del servidor");
        }
    }



    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            await cartService.AddProduct(cartId, productId, quantity);
          
            const carritoID = (req.user.user.cart).toString();
            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            console.log(" error: ", error);
            res.status(500).send("Error de agregar producto");
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            console.log(cart);
            const cart = await cartService.getCartById(cartId); // 

            if (!cart) {
                return { renderView: false, data: res.status(404).json({ message: 'Carrito no encontrado' }) };
            }

            return { renderView: true, data: { cart: cart } };
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            return { renderView: false, data: res.status(500).json({ message: 'Error interno del servidor' }) };
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const cartId = req.params.cid;

            const cart = await cartService.getCartById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }


            cart.products = [];

            await cartService.updateCart(cartId, cart);

            return res.status(200).json({ message: 'Todos los productos han sido eliminados del carrito exitosamente' });
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const newProducts = req.body;


        if (!Array.isArray(newProducts) || newProducts.length === 0) {
            return res.status(400).json({ message: 'El cuerpo de la solicitud no contiene datos de productos válidos' });
        }

        try {
            const cart = await cartService.getCartById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            console.log(cart.products);

            cart.products = newProducts;

            console.log(cart.products);
            await cartService.updateCart(cartId, cart);

            res.status(200).json({ message: 'Carrito actualizado exitosamente', cart: cart });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        try {
            const cart = await cartService.getCartById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const product = cart.products.find(product => product.product.toString() === productId);

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }

            product.quantity = newQuantity;

            await cartService.updateCart(cartId, cart);

            res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente', cart: cart });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async deleteProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            const cart = await cartService.getCartById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            console.log("CART PRODUCTS", cart.products);

            const productIndex = cart.products.findIndex(product => product.product._id.toString() === productId);

            console.log("Products index", productIndex);

            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }

            cart.products.splice(productIndex, 1);

            await cartService.updateCart(cartId, cart);

            return res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartService.getProductsFromCart(cartId);
            console.log("Cart: ", cart);
            const products = cart.products;
            console.log("Productos" ,products);
            // Inicializar un arreglo para almacenar los productos no disponibles
            const productsNotAvailable = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });

            console.log("Ticker", ticket);
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productsNotAvailable });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }




}