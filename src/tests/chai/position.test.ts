import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";


chai.use(chaiHttp)


export async function positiontest() {

    describe('position Route Tests', () => {

        let labelId: string
        let itemId: string
        let roomId: string
        let shelfId: string
        let positionId: string


        //CREATION OF REQUIRED DOCUMENTS AND THEIR IDS

        //create labelId test
        it(`labelCreation`, async () => {
            return await chai.request(app).post('/labels/create')
                .send({
                    name: {"en":"flat slot", "de":"flachschlitz"},
                    colour: "#8A2BE2"
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(201);
                    labelId = res.text.replace(new RegExp("\"", 'g'), "");
                    printToConsole("labelId:" + labelId);
                    chai.expect(res.body).to.exist
                })
        })


        //create itemId test
        it(`itemCreation`, async () => {
            return await chai.request(app).post('/items/create')
                .send({
                    "name": {"en":"motion sensor", "de":"Bewegungssensor"},
                    "description": {"en":"width 2m", "de":"Breite 2m"},
                    "countable": true,
                    "labelIds": [labelId]
                })
                .then(res => {
                    chai.expect(res.status).to.equal(201)
                    itemId = res.text.replace(new RegExp("\"", 'g'), "");
                    printToConsole("itemId:" + itemId);
                    chai.expect(res.body).to.exist
                })
        })

        //create roomId test
        it(`roomCreation`, async () => {
            return await chai.request(app).post('/rooms/create')
                .send({
                    "name": {"en":"A20.0.11", "de":"A20.0.11"},
                    "ipAddress": "127.0.0.4"
                })
                .then(res => {
                    chai.expect(res.status).to.equal(201)
                    roomId = res.text.replace(new RegExp("\"", 'g'), "");
                    printToConsole("roomId:" + roomId);
                    chai.expect(res.body).to.exist
                })
        })


        //create shelfId test
        it(`shelfCreation`, async () => {
            return await chai.request(app).post('/shelves/create')
                .send({
                    "number": 3,
                    "roomId": roomId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(201)
                    shelfId = res.body.replace(new RegExp("\"", 'g'), "");
                    printToConsole("shelfId:" + shelfId);
                    chai.expect(res.body).to.exist
                })
        })


        //TEST POSITION CREATE

        //Test /positions/create
        it(`position:create: should return 201`, async () => {
            return await chai.request(app).post('/positions/create')
                .send({
                    "itemId": itemId,
                    "number": 6,
                    "quantity": 20,
                    "shelfId": shelfId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(201)
                    chai.expect(res.body).to.exist
                    positionId = res.text.replace(new RegExp("\"", 'g'), "")
                })
        })


        //Test /positions/create all attributes have to be defined
        it(`position:create: should return 400 not all attributes are given"`, async () => {
            return await chai.request(app).post('/positions/create')
                .send({
                    "itemId": itemId,
                    "number": 7,
                    "quantity": 20
                })
                .then(res => {
                    chai.expect(res.status).to.equal(400)
                    chai.expect(res.text).to.equal("not all attributes are given")
                })
        })


        //Test /positions/create does position already exist?
        it(`position:create: should return 403 position already exists`, async () => {
            return await chai.request(app).post('/positions/create')
                .send({
                    "itemId": itemId,
                    "number": 6,
                    "quantity": 20,
                    "shelfId": shelfId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(403)
                    chai.expect(res.text).to.equal("position already exists")
                })
        })

        //Test /positions/create shelfId and number have to be defined
        it(`position:create: should return 400 number or shelfId is not given`, async () => {
            return await chai.request(app).post('/positions/create')
                .send({
                    "itemId": itemId,
                    "number": 7,
                    "quantity": 20,
                    "shelfId": null//shelf id not defined
                })
                .then(res => {
                    chai.expect(res.status).to.equal(400)
                    chai.expect(res.text).to.equal("number or shelfId is not given")
                })
        })

        //Test /positions/create countable doesn't fit to quantity
        it(`position:create: should return 400 countable doesn't fit to quantity`, async () => {
            return await chai.request(app).post('/positions/create')
                .send({
                    "itemId": itemId,
                    "number": 7,
                    "quantity": null,//quantity null
                    "shelfId": shelfId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(400)
                    chai.expect(res.text).to.equal("countable doesn't fit to quantity")
                })
        })

        //TEST POSITION GET BY ID

        //Test /positions/getById
        it(`position:getById: should return 200 `, async () => {
            return await chai.request(app).get("/positions/findById/" + positionId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(positionId)
                })
        })

        //TEST POSITION GET ALL

        //Test /positions/getAll
        it(`position:getAll: should return 1 line`, async () => {
            return await chai.request(app).get('/positions/getAll')
                .then(res => {
                    const resJSON: Array<Object> = res.body
                    chai.expect(resJSON.length).to.equal(4);
                    printToConsole('positions:  ' + res.body);
                })
        })


        //TEST POSITION UPDATE

        //Test /positions/update
        it(`position:update: should return 200`, async () => {
            return await chai.request(app).post("/positions/update/" + positionId)
                .send({
                    "itemId": itemId,
                    "number": 6,
                    "quantity": 100,//new quantity
                    "shelfId": shelfId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${positionId}`)
                })
        })


        //Test /positions/update all attributes have to be defined
        it(`position:update: should return 400 not all attributes are given`, async () => {
            return await chai.request(app).post("/positions/update/" + positionId)
                .send({
                    "itemId": itemId,
                    "number": 6,
                    "quantity": 100
                })
                .then(res => {
                    chai.expect(res.status).to.equal(400)
                    chai.expect(res.text).to.equal("not all attributes are given")
                })
        })

        //Test /positions/update only itemId and quantity is updateable, not shelfId and number
        it(`position:update: should return 400 shelf and number are not updatable`, async () => {
            return await chai.request(app).post("/positions/update/" + positionId)
                .send({
                    "itemId": itemId,
                    "number": 3,
                    "quantity": 20,
                    "shelfId": shelfId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(400)
                    chai.expect(res.text).to.equal("shelf and number are not updateable")
                })
        })

        //Test /positions/update quantity has to fit to countable
        it(`position:update: should return 400 countable doesn't fit to quantity`, async () => {
            return await chai.request(app).post("/positions/update/" + positionId)
                .send({
                    "itemId": itemId,
                    "number": 6,
                    "quantity": null,//qunatity null
                    "shelfId": shelfId
                })
                .then(res => {
                    chai.expect(res.status).to.equal(400)
                    chai.expect(res.text).to.equal("countable doesn't fit to quantity")
                })
        })

        //TEST POSITION GET BY ITEMID

        //Test /positions/getByItemId
        it(`position:getByItemId: should return 200 got position by id`, async () => {
            return await chai.request(app).get("/positions/findByItemId/" + itemId)
                .then(res => {
                    chai.expect(res.status).to.equal(200);
                    printToConsole(res.body);
                    chai.expect(res.body[0].itemId).to.equal(`${itemId}`)
                })
        })


        //TEST POSITION DELETE

        //Test /positions/delete
        it(`position:delete: should return 200 one position deleted`, async () => {
            return await chai.request(app).delete("/positions/delete/" + positionId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${positionId}`)
                })
        })

        //DELETION OF REQUIRED DOCUMENTS AND THEIR IDS

        //delete label
        it(`labelDeletion`, async () => {
            return await chai.request(app).delete("/labels/delete/" + labelId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${labelId}`)
                })
        })

        //delete item
        it(`itemDeletion`, async () => {
            return await chai.request(app).delete("/items/delete/" + itemId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${itemId}`)
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

        //delete shelf
        it(`shelfDeletion`, async () => {
            return await chai.request(app).delete("/shelves/delete/" + shelfId)
                .then(res => {
                    chai.expect(res.status).to.equal(200)
                    chai.expect(res.body._id).to.equal(`${shelfId}`)
                })
        })
    })
}
