import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {printToConsole} from "../../modules/util/util.module";
chai.use(chaiHttp)


export async function authTest() {

    describe('auth Route Tests', () => {

       let jwt : string

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
                    password: "!1a3r",
                    role: "Admin",
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(201);
                    printToConsole("userId:" + res.body);
                })
        })


        /** not all attributes are defined, role is not defined but required
         * Test /auth/register
         */
        //not yet implemented
        /*it(`auth:regiter: should return 400`, async () => {
            return await chai.request(app).post('auth/register').send({
                name:	"Max",
                password:	"1#234"
            }).then(res => {
                chai.expect(res.status).to.equal(400)
                printToConsole(res.body);
            })
        })*/

        /** invalid role
         * Test /auth/register
         */
        //not yet implemented
        /*it(`auth:register: should return 400`, async () => {
            return await chai.request(app).post('/auth/register').send({
                name:	"Nele",
                password:	"s1s1",
                role:	"student"
            }).then(res => {
                chai.expect(res.status).to.equal(400)
                printToConsole(res.body);
            })
        })*/

        /**
         * auth/LDAPlogin
         */

        /**
         * LDAPlogin login as user from db
         * Test /auth/loginLDAP
         */
        it(`auth:loginLDAP: should return 200`, async () => {
            return await chai.request(app).post('/auth/loginLDAP')
                .send({
                    name: "Alex",
                    password: "!1a3r"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(200);
                })
        })



        /**
         * LDAPlogin login as user from ldap
         * Test /auth/loginLDAP
         */
        it(`auth:loginLDAP: should return 200`, async () => {
            return await chai.request(app).post('/auth/loginLDAP')
                .send({
                    name: "ergl25",
                    password: "!1a3r"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(200);
                })
        })

        /**
         * LDAPlogin wrong password
         * Test /auth/loginLDAP
         */
        it(`auth:loginLDAP: should return 403`, async () => {
            return await chai.request(app).post('/auth/loginLDAP')
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
         * LDAPlogin user not registred (not in database or ldap)
         * Test /auth/loginLDAP
         */
        it(`auth:loginLDAP: should return 403`, async () => {
            return await chai.request(app).post('/auth/loginLDAP')
                .send({
                    name: "Anna",
                    password: "12"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(403);
                    chai.expect(res.body.message).to.equal("Wrong Credentials");
                })
        })

        /**
         * getJWT from User to logout
         */
        it(`user:getByName: should return 200`, async () => {
            return await chai.request(app).post('/user/getByName/Alex')
                .then(async res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body).to.exist
                    jwt = res.body.jwt.replace(new RegExp("\"", 'g'), "");
                    printToConsole(jwt);
                })
        })


        /**
         * auth/logout
         */

        /**
         * logout user
         * Test /auth/logout
         */
        it(`auth:logout: should return 200`, async () => {
            return await chai.request(app).post('/auth/logout')
                .set({ Authorization: "Basic "+jwt })
                .then(async res => {
                    chai.expect(res.status).to.equal(200);
                })
        })

        /**
         * logout user invalid jwt
         * Test /auth/logout
         */
        it(`auth:logout: should return 403`, async () => {
            return await chai.request(app).post('/auth/logout')
                .set({ Authorization: "Basic invalid" })
                .then(async res => {
                    chai.expect(res.status).to.equal(403);
                })
        })

        /**
         * logout user no user with such jwt
         * Test /auth/logout
         */
        it(`auth:logout: should return 500`, async () => {
            return await chai.request(app).post('/auth/logout')
                .set({ Authorization: "Basic 1234" })
                .then(async res => {
                    chai.expect(res.status).to.equal(500);
                })
        })
    })
}