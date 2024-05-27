import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import supertest from 'supertest';
import { UserController } from "../src/controllers/usercontroller.js";
import { UserService } from "../src/services/userservice.js";


const app = express();
app.use(express.json());

const requester = supertest("http://localhost:8080"); 
describe('User Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('register', () => {
        it('should handle existing user', async () => {
            const req = {
                body: {
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    age: 30
                },
                logger: { error: () => { } }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            // Stub del servicio para simular un usuario existente
            sandbox.stub(UserService.prototype, 'getUserByEmail').resolves({});

            const userController = new UserController();
            await userController.register(req, res);

            // Verificar que se haya enviado la respuesta adecuada
            expect(res.status.calledOnceWith(409)).to.be.true;
            expect(res.send.calledOnceWith('El usuario ya existe')).to.be.true;
        });

        it('The user should be logged in and the cookie retrieved', async () => {
         
            const newUser = {
                    first_name: 'John',
                    last_name: 'Marcos',
                    email: 'john@gmail.com',
                    password: '1234',
                    age: 30
                }
         

            const res = await requester.post("/api/users/register").send(newUser);


            expect(res.header['set-cookie']).to.be.an('array').that.is.not.empty;
            expect(res.header['set-cookie'][0]).to.include('coderCookieToken');
            expect(res.header['set-cookie'][0]).to.include('Max-Age=3600');
        });
    });


});
