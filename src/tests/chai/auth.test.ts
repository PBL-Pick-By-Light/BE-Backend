import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {printToConsole} from "../../modules/util/util.module";
chai.use(chaiHttp)


export async function authTest() {

    describe('auth Route Tests', () => {

        /**
         * auth/register
         */

        /**
         * Registrate a new user in database
         * Test /auth/register
         */
        it(`auth:register: should return 201`, async () => {
            return await chai.request(app).post('/auth/register')
                .send({
                    name: "Alex",
                    password: "!1a3r"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(201);
                    printToConsole("userId:" + res.body);
                })
        })

        /**
         * Registrate a new user in database
         * Test /auth/register
         */
        it(`auth:register: should return 400`, async () => {
            return await chai.request(app).post('/auth/register')
                .send({
                    name: "Alex",
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(400);
                })
        })

        /**
         * Registrate a new user in database
         * Test /auth/register
         */
        it(`auth:register: should return 400`, async () => {
            return await chai.request(app).post('/auth/register')
                .send({
                    password: "!1a3r"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(400);
                })
        })

        /**
         * LOGINlogin login as user from db
         * Test /auth/login
         */
        it(`auth:login: should return 200`, async () => {
            return await chai.request(app).post('/auth/login')
                .send({
                    name: "Alex",
                    password: "!1a3r"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(200);
                })
        })

        /**
         * LOGINlogin wrong password
         * Test /auth/login
         */
        it(`auth:login: should return 403`, async () => {
            return await chai.request(app).post('/auth/login')
                .send({
                    name: "Alex",
                    password: "12"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(403);
                    chai.expect(res.body.message).to.equal("Password wrong");
                })
        })

        /**
         * LOGINlogin user not registred (not in database or login)
         * Test /auth/login
         */
        it(`auth:login: should return 403`, async () => {
            return await chai.request(app).post('/auth/login')
                .send({
                    name: "Anna",
                    password: "12"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(403);
                })
        })
    })
}
