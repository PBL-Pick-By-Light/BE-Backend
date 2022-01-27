import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {printToConsole} from "../../modules/util/util.module";
import users from "../testdata/users.json"

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
                    let userArr = res.body
                    let userJsonArrLen = users.userSketches.length
                    chai.expect(res.status).to.equal(200)
                    chai.expect(userArr.length).to.equal(userJsonArrLen)
                })
        })


        /** Create new User
         * Test /users/create
         */
        it(`user:create: should return 201 and id`, async () => {
            return await chai.request(app).post('/auth/register').send({
                    name:	"Elsa",
                    password:	"12345",
                    role:	"Admin"
                }).then(res => {
                    printToConsole(res.body);
                    chai.expect(res.status).to.equal(201)
                    userId = res.body;
                    printToConsole(userId);
                })
        })

        /** Create - Bad Request due to missing name
         * Test /users/create
         */
        it(`user:create: should return 400`, async () => {
            return await chai.request(app).post('/users/create').send({
                    name:	"",
                    password:	"12345",
                    role:	"Admin"
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
                role:	"Editor"
                }).then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${userId}`)
                })
        })

        /** Update User - Bad Request due to missing role
         * Test /users/update
         */
        it(`user:update: should return 400`, async () => {
            return await chai.request(app).post("/users/update/" + userId).send({
                name:	"Hans",
                password:	"Princ3",
                role:	""
            }).then(res => {
                    chai.expect(res.status).to.equal(400)
                })
        })

        /** Update User - Bad Request due to missing name
         * Test /users/update
         */
        it(`user:update: should return 400`, async () => {
            return await chai.request(app).post("/users/update/" + userId).send({
                name:	"",
                password:	"50114",
                role:	"Admin"
            }).then(res => {
                chai.expect(res.status).to.equal(400)
            })
        })

        /** Update User - Bad Request due to missing password
         * Test /users/update
         */
        it(`user:update: should return 400`, async () => {
            return await chai.request(app).post("/users/update/" + userId).send({
                name:	"Elsa",
                password:	"",
                role:	"Admin"
            }).then(res => {
                chai.expect(res.status).to.equal(400)
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

