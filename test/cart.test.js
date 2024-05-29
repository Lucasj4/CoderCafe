import { expect } from 'chai';

import express from 'express';
import supertest from 'supertest';
import { UserController } from "../src/controllers/usercontroller.js";
import { UserService } from "../src/services/userservice.js";
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

const requester = supertest("http://localhost:8080"); 

describe('CartController', function() {
    let createdCartId = null;
    let testProductId = '65cbcf7bbbeb5c37b9e68664'; // Reemplaza con un ID de producto válido para pruebas
    let testUserId = 'someUserId'; // Reemplaza con un ID de usuario válido para pruebas
    let token = 'someValidToken'; // Reemplaza con un token válido

    before(async function() {
        // Setup necessary data here, like creating a user, product, etc.
        // For example:
        // const user = await UserModel.create({ ... });
        // const product = await ProductService.create({ ... });
        // testProductId = product._id;
        // testUserId = user._id;
        // token = await getValidTokenForUser(user);
    });

    after(async function() {
        // Cleanup data created during tests
        if (createdCartId) {
            await requester.delete(`/api/carts/${createdCartId}`);
        }
    });

    it('should create a new cart', async function() {
        const res = await requester.post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('cart');
        createdCartId = res.body.cart._id;
    });

    // it('should add a product to the cart', async function() {
    //     const res = await requester.post(`/api/carts/${createdCartId}/products/${testProductId}`)
    //         .set('Authorization', `Bearer ${token}`)
    //         .send({ quantity: 2 });

    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('message', 'Producto agregado exitosamente al carrito');
    // });

    // it('should get cart by ID', async function() {
    //     const res = await requester.get(`/api/carts/${createdCartId}`)
    //         .set('Authorization', `Bearer ${token}`);

    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('data');
    //     expect(res.body.data).to.have.property('cart');
    // });

    // it('should update product quantity in the cart', async function() {
    //     const res = await requester.put(`/api/carts/${createdCartId}/products/${testProductId}`)
    //         .set('Authorization', `Bearer ${token}`)
    //         .send({ quantity: 5 });

    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('message', 'Cantidad de producto actualizada exitosamente');
    // });

    // it('should delete product from the cart', async function() {
    //     const res = await requester.delete(`/api/carts/${createdCartId}/products/${testProductId}`)
    //         .set('Authorization', `Bearer ${token}`);

    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('message', 'Producto eliminado del carrito exitosamente');
    // });

    // it('should delete all products from the cart', async function() {
    //     const res = await requester.delete(`/api/carts/${createdCartId}/products`)
    //         .set('Authorization', `Bearer ${token}`);

    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('message', 'Todos los productos han sido eliminados del carrito exitosamente');
    // });

    // it('should finish purchase', async function() {
    //     const res = await requester.post(`/api/carts/${createdCartId}/purchase`)
    //         .set('Authorization', `Bearer ${token}`)
    //         .send();

    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('message', 'Compra finalizada exitosamente');
    // });
});