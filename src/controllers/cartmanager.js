import { CartService } from "../services/cartservice.js";
import UserModel from '../models/user.model.js';
import {ProductService} from '../services/productservice.js';
import TicketModel from "../models/ticketmodel.js";
import { generateUniqueCode, calculateTotal } from "../utils/cartutils.js";
import { EmailManager } from "./emailmanager.js";

const emailManager = new EmailManager();
const cartService = new CartService();
const productService = new ProductService();

export default class CartController {
    async addCart(req, res) {
        try {
            const newCart = await cartService.createCart({ products: [] });
            res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
        } catch (error) {
            req.logger.error(`Error: ${error}`);
            res.status(500).json("Error interno del servidor");
        }
    }



    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            await cartService.AddProduct(cartId, productId, quantity);

            const carritoID = (req.user.cart).toString();

            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            req.logger.error("Error al agregar producto: " + error);
            res.status(500).send("Error de agregar producto");
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            req.logger.info(cart);
            const cart = await cartService.getCartById(cartId); // 

            if (!cart) {
                return { renderView: false, data: res.status(404).json({ message: 'Carrito no encontrado' }) };
            }

            return { renderView: true, data: { cart: cart } };
        } catch (error) {
            req.logger.error('Error al obtener el carrito:' + error);
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
            req.logger.error('Error al eliminar todos los productos del carrito:', error);
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

            cart.products = newProducts;
           
            await cartService.updateCart(cartId, cart);

            res.status(200).json({ message: 'Carrito actualizado exitosamente', cart: cart });
        } catch (error) {
            req.logger.error('Error al actualizar el carrito:', error);
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
            req.logger.error('Error al actualizar la cantidad del producto en el carrito:', error);
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

            const productIndex = cart.products.findIndex(product => product.product._id.toString() === productId);

            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }

            cart.products.splice(productIndex, 1);

            await cartService.updateCart(cartId, cart);

            return res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
        } catch (error) {
            req.logger.error('Error al eliminar el producto del carrito:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartService.getProductsFromCart(cartId);
            req.logger.info("Cart: " + cart);
            const products = cart.products;
            req.logger.info("Productos" + products);
          
            const productsNotAvailable = [];

            
            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (product.stock >= item.quantity) {
                    
                    product.stock -= item.quantity;
                    await product.save();
                } else {
               
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });

            req.logger.info("Ticker" + ticket);
            await ticket.save();

            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));

    
            await cart.save();

            await emailManager.sendPurchaseEmail(userWithCart.email, userWithCart.first_name, ticket._id);

            res.render("checkout", {
                client: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket._id 
            });
        } catch (error) {
            req.logger.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }




}