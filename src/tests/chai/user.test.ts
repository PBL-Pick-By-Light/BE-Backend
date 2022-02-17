import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {printToConsole} from "../../modules/util/util.module";
import users from "../testdata/users.json"
import crypto from "crypto";

chai.use(chaiHttp)

export async function userTest() {

    let userId: string;

    describe('User Route Tests', () => {

        /**
         * Test /users/getAll and compare length with ../testdata/user.json
         */
        it(`user:getAll: should return 200`, async () => {
            return await chai.request(app).get('/users/getAll')
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                })
        })


        /** Create new User
         * Test /users/create
         */
        it(`user:create: should return 201 and id`, async () => {
            return await chai.request(app).post('/auth/register').send({
                    name:	"Elsa",
                    password:	"12345",
                    role:	"admin"
                }).then(res => {
                    printToConsole(res.body);
                    chai.expect(res.status).to.equal(201)
                    userId = res.body;
                    printToConsole(userId);
                })
        })

        /** Create new User
         * Test /users/create
         */
        it(`user:create: incorrect role should return 400 error message`, async () => {
            return await chai.request(app).post('/users/create').send({
                    name:	"Elsa",
                    password:	"12345",
                    role:	"Admin"
                }).then(res => {
                    printToConsole(res.body);
                    chai.expect(res.status).to.equal(400)
                })
        })

        /** Create - Bad Request due to missing name
         * Test /users/create
         */
        it(`user:create: should return 400`, async () => {
            return await chai.request(app).post('/users/create').send({
                    name:	"",
                    password:	"12345",
                    role:	"admin"
                }).then(res => {
                    printToConsole(res.body);
                    chai.expect(res.status).to.equal(400)

                })
        })

        /** Create - Bad Request due to missing password
         * Test /users/create
         */
        it(`user:create: should return 400`, async () => {
            return await chai.request(app).post('/users/create').send({
                name:	"Kristoff",
                password:	"",
                role:	"User"
            }).then(res => {
                printToConsole(res.body);
                chai.expect(res.status).to.equal(400)

            })
        })

        /** Create - Bad Request due to missing role
         * Test /users/create
         */
        it(`user:create: should return 400`, async () => {
            return await chai.request(app).post('/users/create').send({
                name:	"Olaf",
                password:	"snowman",
                role:	""
            }).then(res => {
                printToConsole(res.body);
                chai.expect(res.status).to.equal(400)
            })
        })

        /** Create - Bad Request due to not existing role
         * Test /users/create
         */
        it(`user:create: should return 400`, async () => {
            return await chai.request(app).post('/users/create').send({
                name:	"Sven",
                password:	"horsessuck123",
                role:	"Reindeer"
            }).then(res => {
                printToConsole(res.body);
                chai.expect(res.status).to.equal(400)
            })
        })


        /** Update User
         * Test /users/update
         */
        it(`user:update: should return 200`, async () => {
            return await chai.request(app).post("/users/update/" + userId).send({
                name:	"Anna",
                password:	"54321",
                role:	"editor"
                }).then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${userId}`)
                })
        })

        /** Update User - Add firstname and lastname
         * Test /users/update
         */
        it(`user:update: should return 200`, async () => {
            return await chai.request(app).post("/users/update/" + userId).send({
                name:	"Hans",
                password:	"Princ3",
                firstname: "Hans",
                lastname: "Turing"
            }).then(res => {
                    chai.expect(res.status).to.equal(200)
                })
        })

        /** Update User - Bad Request due wrong User Id
         * Test /users/update
         */
        it(`user:update: should return 400 due to wrong User Id`, async () => {
            const fakeId = crypto.randomBytes(32).toString("hex")
            return await chai.request(app).post("/users/update/" + fakeId).send({
                name:	"Elsa",
                password:	"lykjf0394",
                role:	"admin"
            }).then(res => {
                chai.expect(res.status).to.equal(404)
            })
        })

        /** Delete  User
         * Test /users/delete
         */
        it(`user:delete: should return 200 and deleted shelf`, async () => {
            return await chai.request(app).delete('/users/delete/' + userId).then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${userId}`)
                })
        })


    })

}

