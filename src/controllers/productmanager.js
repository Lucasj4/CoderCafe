import { ProductService } from "../services/productservice.js";
import CustomError from "../services/errors/custom-error.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import { Errors } from "../services/errors/enums.js";
const productService = new ProductService();

export default class ProductController {

    async addProduct(req, res, next) {
        const { title, description, price, code, stock, category, thumbnails, status, img} = req.body;

        const roleUser = req.user.user.rol;


        if (roleUser === "User") {
            return res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
        }
        try {
            if (!title || !description || !price || !code || !stock || !category || !status || !img === undefined) {
                const error = new CustomError({
                    name: "Producto nuevo",
                    cause: generateProductErrorInfo({ title, description, price, code, stock, category, status }),
                    message: "Error al crear producto",
                    code: Errors.MISSING_DATA_ERROR
                });
                
                throw error;
            }

            const existProduct = await productService.findProductByCode(code);

            if (existProduct) {
                return res.status(409).json({ error: "Ya existe un producto con el mismo código" });
            }

            req.logger.info("Rol de usuario: " + roleUser)
            const owner = roleUser === 'Premium' ? req.user.user.email : 'Admin';

            const newProduct = {
                title,
                description,
                price,
                code,
                stock,
                img,
                category,
                status,
                thumbnails: thumbnails || [],
                owner
            };

            await productService.createProduct(newProduct);
            res.status(201).json({ message: "Producto agregado con éxito", product: newProduct });
        } catch (error) {
            
            if (!(error instanceof CustomError)) {
                error = new CustomError({
                    message: error.message,
                    code: error.code || Errors.INTERNAL_SERVER_ERROR
                });
            }
           
            next(error);

        }
    }



    async getProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const page = parseInt(req.query.page) || 1;
            const query = req.query.query;
            const filter = query && query.trim() !== '' ? JSON.parse(query) : {};
            const sort = parseInt(req.query.sort) || null;
            const products = await productService.getProducts(limit, page, sort, filter);

            res.json(products)
        } catch (error) {
            req.logger.error("Error al obtener productos:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getProductById(req, res) {
        const productId = req.params.productId;

        try {
            const product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(product);
        } catch (error) {
            req.logger.error("Error al obtener el producto por ID:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async updateProduct(req, res) {
        const productId = req.params.productId;
        const productUpdated = req.body;
        const userRole = req.user.rol;

        try {
            const product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: "Producto no encontrado" });
            }

            // Verificar si el usuario es administrador o propietario del producto
            if (userRole === 'Admin' || (userRole === 'Premium' && product.owner.equals(req.user.email))) {
                await productService.updateProduct(productId, productUpdated);
                res.status(200).json({ message: 'Producto actualizado con éxito', product: productUpdated });
            } else {
                res.status(403).json({ success: false, message: 'No tienes permiso para actualizar este producto' });
            }
        } catch (error) {
            req.logger.error("Error al actualizar el producto:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async deleteProduct(req, res) {

        const productId = req.params.productId;
        const userRole = req.user.rol;
        const userEmail = req.user.email

        try {
            const product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: "Producto no encontrado" });
            }

            // Verificar si el usuario es administrador o propietario del producto
            if (userRole === 'Admin' || (userRole === 'Premium' && product.owner === userEmail)) {
                await productService.deleteProduct(productId);
                res.status(200).json({ success: true, message: 'Producto eliminado con éxito' });
            } else {
                res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este producto' });
            }
        } catch (error) {
            req.logger.error("Error al eliminar producto:", error.message);
            res.status(500).json({ success: false, error: "Error interno del servidor al eliminar el producto" });
        }
    }


}

export { ProductController };


