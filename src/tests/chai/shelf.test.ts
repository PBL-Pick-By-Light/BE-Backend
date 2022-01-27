import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {printToConsole} from "../../modules/util/util.module";

let mongo = require("mongoose")

chai.use(chaiHttp)

export async function shelftest() {

    describe('shelve Route Tests', () => {
        let roomId: string
        let shelfId: string
        /**
         * Test /shelves/getAll and compare length with ../testdata/shelves.json
         */
        it(`shelf:getAll: should return 200`, async () => {
            return await chai.request(app).get('/shelves/getAll')
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                })
        })
// Create new room because we need the room ID 
        it(`roomCreation`, async () => {
            return await chai.request(app).post('/rooms/create')
                .send({
                    "name": {"en":"A20.00.11", "de":"A20.00.11"},
                    "ipAddress": "127.0.0.4"
                })
                .then(res => {
                    chai.expect(res.status).to.equal(201)
                    roomId = res.body
                })
        })

        /** Create new Shelf
         * Test /shelves/create
         */
        it(`should return 201 and id`, async () => {
            return await chai.request(app).post('/shelves/create')
                .send({
                    number: 3,
                    roomId: mongo.Types.ObjectId(roomId)
                })
                .then(res => {
                    printToConsole(res.body);
                    chai.expect(res.status).to.equal(201)
                    shelfId = res.body;
                    printToConsole(shelfId);
                })
        })

        //Test /shelves/update
        it(`Shelf:update: should return 200`, async () => {
            return await chai.request(app).post("/shelves/update/" + shelfId)
                .send({
                    number: 3,
                    roomId: mongo.Types.ObjectId(roomId)
                })
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${shelfId}`)
                })
        })


        /**
         * TEST Shelves FindById
         * Test /shelves/findByID ../testdata/shelves.json
         */
        it(`shelf:findByID: should return 200 and got shelf`, async () => {
            return await chai.request(app).get('/shelves/findByID/' + shelfId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${shelfId}`)
                })
        })


        /** Delete  Shelf
         * Test /shelves/Delete a
         */
        it(`shelf:delete: should return 200 and deleted shelf`, async () => {
            return await chai.request(app).delete('/shelves/delete/' + shelfId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${shelfId}`)
                })
        })

        //delete room
        it(`roomDeletion`, async () => {
            return await chai.request(app).delete("/rooms/delete/" + roomId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${roomId}`)
                })
        })
    })

}

