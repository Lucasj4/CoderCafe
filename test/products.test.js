import { expect } from 'chai';
import sinon from 'sinon';
import { ProductController } from '../src/controllers/productmanager.js';
import { ProductService } from '../src/services/productservice.js';
import CustomError from '../src/services/errors/custom-error.js';
import { generateProductErrorInfo } from '../src/services/errors/info.js';
import { Errors } from '../src/services/errors/enums.js';

describe('ProductController', () => {
    let productController;
    let req;
    let res;
    let next;
    let sandbox;

    beforeEach(() => {
        productController = new ProductController();
        req = {
            body: {},
            params: {},
            query: {},
            user: { user: { rol: 'Admin' } },
            logger: { info: sinon.stub(), error: sinon.stub() }
        };
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
            json: sinon.stub()
        };
        next = sinon.stub();
        sandbox = sinon.createSandbox(); // Crear un sandbox de Sinon.js
    });

    afterEach(() => {
        sandbox.restore(); // Restaurar el sandbox después de cada prueba
    });

    describe('addProduct', () => {
        it('should return 403 if user role is "User"', async () => {
            req.user.user.rol = 'User'; // Configurar el rol de usuario
            await productController.addProduct(req, res, next);
            expect(res.status.calledWith(403)).to.be.true; // Verificar que se llamó a res.status con 403
            expect(res.send.calledWith('Acceso denegado. No tienes permiso para acceder a esta página.')).to.be.true; // Verificar el mensaje de respuesta
        });

        it('should call next with error if required fields are missing', async () => {
            req.body = { title: '', description: '', price: '', code: '', stock: '', category: '', status: undefined }; // Configurar el cuerpo de la solicitud
            await productController.addProduct(req, res, next);
            expect(next.calledOnce).to.be.true; // Verificar que se llamó a next una vez
            const error = next.getCall(0).args[0]; // Obtener el argumento de la llamada a next
            expect(error).to.be.instanceOf(CustomError); // Verificar que el error es una instancia de CustomError
            // expect(error.code).to.equal(Errors.MISSING_DATA_ERROR); // Verificar el código de error
        });

        it('should return 409 if product already exists', async () => {
            sandbox.stub(ProductService.prototype, 'findProductByCode').resolves(true); // Crear un stub para findProductByCode que resuelve true
            req.body = { title: 'Test', description: 'Test', price: 100, code: '123', stock: 10, category: 'Test', status: true };
            await productController.addProduct(req, res, next);
            expect(res.status.calledWith(409)).to.be.true; // Verificar que se llamó a res.status con 409
            expect(res.json.calledWith({ error: "Ya existe un producto con el mismo código" })).to.be.true; // Verificar la respuesta JSON
        });

        it('should create a new product if data is valid', async () => {
            sandbox.stub(ProductService.prototype, 'findProductByCode').resolves(false); // Crear un stub para findProductByCode que resuelve false
            sandbox.stub(ProductService.prototype, 'createProduct').resolves(); // Crear un stub para createProduct que resuelve
            req.body = { title: 'Test', description: 'Test', price: 100, code: '123', stock: 10, category: 'Test', status: true };
            req.user.user.email = 'test@example.com';

            await productController.addProduct(req, res, next);
            expect(res.status.calledWith(201)).to.be.true; // Verificar que se llamó a res.status con 201
            expect(res.json.calledOnce).to.be.true; // Verificar que se llamó a res.json una vez
            const response = res.json.getCall(0).args[0]; // Obtener el argumento de la llamada a res.json
            expect(response).to.have.property('message', 'Producto agregado con éxito');
            expect(response.product).to.include({ title: 'Test', description: 'Test', price: 100, code: '123', stock: 10, category: 'Test', status: true });
        });
    });

    // Continuación de las demás pruebas para getProducts, getProductById, updateProduct, deleteProduct...

    describe('getProducts', () => {
        it('should return products with default pagination', async () => {
            const products = [{ title: 'Test Product' }];
            sandbox.stub(ProductService.prototype, 'getProducts').resolves(products); // Crear un stub para getProducts que resuelve products
            req.query = {};

            await productController.getProducts(req, res);
            expect(res.json.calledWith(products)).to.be.true; // Verificar que se llamó a res.json con products
        });

        it('should handle errors and return 500', async () => {
            sandbox.stub(ProductService.prototype, 'getProducts').throws(new Error('Test error')); // Crear un stub para getProducts que lanza un error

            await productController.getProducts(req, res);
            expect(res.status.calledWith(500)).to.be.true; // Verificar que se llamó a res.status con 500
            expect(res.json.calledWith({ error: 'Error interno del servidor' })).to.be.true; // Verificar la respuesta JSON
        });
    });

    describe('getProductById', () => {
        it('should return a product if found', async () => {
            const product = { title: 'Test Product' };
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(product); // Crear un stub para getProductById que resuelve product
            req.params.productId = '123';

            await productController.getProductById(req, res);
            expect(res.status.calledWith(200)).to.be.true; // Verificar que se llamó a res.status con 200
            expect(res.json.calledWith(product)).to.be.true; // Verificar que se llamó a res.json con product
        });

        it('should return 404 if product not found', async () => {
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(null); // Crear un stub para getProductById que resuelve null
            req.params.productId = '123';

            await productController.getProductById(req, res);
            expect(res.status.calledWith(404)).to.be.true; // Verificar que se llamó a res.status con 404
            expect(res.json.calledWith({ error: 'Producto no encontrado' })).to.be.true; // Verificar la respuesta JSON
        });

        it('should handle errors and return 500', async () => {
            sandbox.stub(ProductService.prototype, 'getProductById').throws(new Error('Test error')); // Crear un stub para getProductById que lanza un error
            req.params.productId = '123';

            await productController.getProductById(req, res);
            expect(res.status.calledWith(500)).to.be.true; // Verificar que se llamó a res.status con 500
            expect(res.json.calledWith({ error: 'Error interno del servidor' })).to.be.true; // Verificar la respuesta JSON
        });
    });

    describe('updateProduct', () => {
        it('should update a product if user is Admin', async () => {
            const product = { title: 'Test Product', owner: 'Admin' };
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(product); // Crear un stub para getProductById que resuelve product
            sandbox.stub(ProductService.prototype, 'updateProduct').resolves(); // Crear un stub para updateProduct que resuelve
            req.params.productId = '123';
            req.body = { title: 'Updated Product' };
            req.user.rol = 'Admin';

            await productController.updateProduct(req, res);
            expect(res.status.calledWith(200)).to.be.true; // Verificar que se llamó a res.status con 200
            expect(res.json.calledWith({ message: 'Producto actualizado con éxito', product: req.body })).to.be.true; // Verificar la respuesta JSON
        });

        it('should return 403 if user is not Admin or owner', async () => {
            const product = { title: 'Test Product', owner: 'anotherUser' };
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(product); // Crear un stub para getProductById que resuelve product
            req.params.productId = '123';
            req.body = { title: 'Updated Product' };
            req.user.rol = 'User';
            req.user._id = 'testUserId';

            await productController.updateProduct(req, res);
            expect(res.status.calledWith(403)).to.be.true; // Verificar que se llamó a res.status con 403
            expect(res.json.calledWith({ success: false, message: 'No tienes permiso para actualizar este producto' })).to.be.true; // Verificar la respuesta JSON
        });

        it('should return 404 if product not found', async () => {
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(null); // Crear un stub para getProductById que resuelve null
            req.params.productId = '123';

            await productController.updateProduct(req, res);
            expect(res.status.calledWith(404)).to.be.true; 
            expect(res.json.calledWith({ success: false, message: 'Producto no encontrado' })).to.be.true; 
        });

        it('should handle errors and return 500', async () => {
            sandbox.stub(ProductService.prototype, 'getProductById').throws(new Error('Test error')); // Crear un stub para getProductById que lanza un error
            req.params.productId = '123';

            await productController.updateProduct(req, res);
            expect(res.status.calledWith(500)).to.be.true; // Verificar que se llamó a res.status con 500
            expect(res.json.calledWith({ message: 'Error interno del servidor' })).to.be.true; // Verificar la respuesta JSON
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product if user is Admin', async () => {
            const product = { title: 'Test Product', owner: 'Admin' };
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(product); // Crear un stub para getProductById que resuelve product
            sandbox.stub(ProductService.prototype, 'deleteProduct').resolves(); // Crear un stub para deleteProduct que resuelve
            req.params.productId = '123';
            req.user.rol = 'Admin';

            await productController.deleteProduct(req, res);
            expect(res.status.calledWith(200)).to.be.true; // Verificar que se llamó a res.status con 200
            expect(res.json.calledWith({ success: true, message: 'Producto eliminado con éxito' })).to.be.true; // Verificar la respuesta JSON
        });

        it('should return 403 if user is not Admin or owner', async () => {
            const product = { title: 'Test Product', owner: 'anotherUser' };
            sandbox.stub(ProductService.prototype, 'getProductById').resolves(product); // Crear un stub para getProductById que resuelve product
            req.params.productId = '123';
            req.user.rol = 'User';
            req.user._id = 'testUserId';

            await productController.deleteProduct(req, res);
            expect(res.status.calledWith(403)).to.be.true; 
            expect(res.json.calledWith({ success: false, message: 'No tienes permiso para eliminar este producto' })).to.be.true; 
        });

        // it('should return 200 if user is Admin or owner', async () => {
        //     const product = { title: 'Test Product', owner: 'premium@gmail.com' };
        //     sandbox.stub(ProductService.prototype, 'getProductById').resolves(product); // Crear un stub para getProductById que resuelve product
        //     req.params.productId = '123';
        //     req.user.rol = 'Premium';
        //     req.user.email = 'premium@gmail.com';

        //     await productController.deleteProduct(req, res);
        //     expect(res.status.calledWith(200)).to.be.true; 
        //     expect(res.json.calledWith({ success: true, message: 'Producto eliminado con éxito' })).to.be.true; 
        // });

        // Más pruebas...
    });
});
