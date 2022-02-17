    import {app} from '../../index';
    import chai from 'chai';
    import mongoose from "mongoose";
    import {Room, RoomClass} from "../../models/room.model";
    import {printToConsole} from "../../modules/util/util.module";
    import { RoomModule } from '../../modules/entities/room.module';
    import { MongoModule } from '../../modules/mongo/mongo.module';

    export async function roomTest() {


        let testId: mongoose.Types.ObjectId | null;
        let testRoom: Room | null;
        const mongoModule: MongoModule = new MongoModule();
        const roomModule: RoomModule = new RoomModule(mongoModule);

    describe('Room Route Tests', async () => {

        // Create routes:
        //name: toJson(generateEnglishGermanMap("Caragdûr", "Caragdûr")),

        // Create a new label without color
        it(`should return 201 and id of created room`, async () => {
            return await chai.request(app).post('/rooms/create').send({
                name: {"de":"Caragdûr", "en":"Caragdûr"},
                ipAddress: "169.141.160.185"
            }).then(async res => {

                chai.expect(res.status).to.equal(201);
                chai.expect(res.body).to.exist
                await roomModule.deleteRoomById(res.body)
            })
        })

        // Create - Bad Request due to empty name.
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/rooms/create').send({
                "name": {"en": "","de": ""},
                "colour": "20.23.161.215"
            }).then(res => {

                chai.expect(res.status).to.equal(400);
            })
        })

        // Create - Bad Request due to missing ip-Address

        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/rooms/create').send({
                "name": {"en": "Tol Himring","de": "Tol Himring"}

            }).then(res => {

                chai.expect(res.status).to.equal(400);
            })
        })

        // Create - Bad Request due to missing invalid IpAddress
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/rooms/create').send({
                name: {"en": "invalidIpAddress","de": "ungültigeIPAdresse"},
                ipAddress: "#2023161215"
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })

        // Read routes:

        it(`should return 200 and all rooms`, async () => {
            return await chai.request(app).get('/rooms/getAll').then(res => {
                chai.expect(res.status).to.equal(200);
            })
        })

        it(`should return 200 and the correct room 1`, async () => {
            testId = await roomModule.createRoom(
                {
                    name: new Map<string, string>().set("en", "House of the Fountain, Mainhall").set("de", "Haus des Brunnens, Große Halle"),
                    ipAddress: "77.22.176.110"
                }
            )
            if (!testId) {
                printToConsole("Something went wrong creating the test room")
            }
            return await chai.request(app).get(`/rooms/findById/${testId}`).then(async res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.name.en).to.equal("House of the Fountain, Mainhall");
                //  to avoid duplicates, delete Label after test has finished
                if (testId) {
                    await roomModule.deleteRoomById(testId)
                }
            })
        })


        // Update routes:

        // Update with a single reference to a label

        it(`should return 200 and the updated room 2`, async () => {
            testId = await roomModule.createRoom({
                name: new Map<string, string>().set("en", "Palace, Tirion").set("de", "Palast, Tirion"),
                ipAddress: "17.143.211.90"
            })
            if (!testId) {
                printToConsole("Something went wrong creating the testRoom")
            }
            return await chai.request(app).post(`/rooms/update/${testId}`).send({
                "name": {"en": "Havens of Sirion","de": "Palast, Tirion"},
                "ipAddress": "17.143.211.90"
            }).then(async res => {

                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.name.en).to.equal("Havens of Sirion")
                if (testId != null) {
                    await roomModule.deleteRoomById(testId)
                }
            })

        })

        // update  - change Ip
        it(`should return 200 and the updated room 3`, async () => {
            testId = await roomModule.createRoom(
                {
                    name: new Map<string, string>().set("en", "Vingilot, Captain's Cabin").set("de", "Vingilot, Kapitänskajüte"),
                    ipAddress: "17.143.211.91"
                }
            )
            if (!testId) {
                printToConsole("Something went wrong creating the testRoom");
            }
            return await chai.request(app).post(`/rooms/update/${testId}`).send({
                name: {"en": "Vingilot, Captain's Cabin","de": "Vingilot, Kapitänskajüte"},
                ipAddress: "27.143.211.92"
            }).then(res => {

                chai.expect(res.status).to.equal(200);
                if (testId) {
                    roomModule.deleteRoomById(testId)
                }
            })
        })

        // Update - Bad Request due to empty name.

        it(`should return 400 and text 'Bad Request'`, async () => {
            testId = await roomModule.createRoom({
                name: new Map<string, string>().set("en", "Moria").set("de", "Moria"),
                ipAddress: "9.86.127.223"
            })
            if (!testId) {
                printToConsole("Something went wrong creating the testRoom");
            }
            return await chai.request(app).post(`/rooms/update/${testId}`).send({
                "name": {"en":"","de":""},
                "ipAddress": "9.86.127.223"
            }).then(async res => {

                chai.expect(res.status).to.equal(400);
                if (testId) {
                    await roomModule.deleteRoomById(testId)
                }
            })
        })


        // Update - Bad Request due to invalid ipAddress.

        it(`should return 400 and text 'Bad Request'`, async () => {
            testId = await roomModule.createRoom({
                name: new Map<string, string>().set("en", "Erebor").set("de", "Der einsame Berg"),
                ipAddress: "9.86.127.223"
            })
            if (!testId) {
                printToConsole("Something went wrong creating the testRoom");
            }
            return await chai.request(app).post(`/rooms/update/${testId}`).send({
                "name": {"en": "Erebor","de": "Der einsame Berg"},
                "ipAddress": "1111119.86.127223"
            }).then(async res => {
                chai.expect(res.status).to.equal(400)
                if (testId) {
                    await roomModule.deleteRoomById(testId)
                }
            })

        })

        // Update - Ok even with duplikate ip
        it(`should return 200`, async () => {
            testRoom = new RoomClass("213.101.20.70", new Map<string, string>().set("en", "Mando's Halls").set("de", "Unterwelt"))
            let testRoom1 = new RoomClass("113.111.21.71", new Map<string, string>().set("en", "Gardens of Irmo").set("de", "Garten der Träume"))
            testId = await roomModule.createRoom(testRoom)
            let testId1 = await roomModule.createRoom(testRoom1)
            if (!(testId && testId1)) {
                printToConsole("Something went wrong creating the testRooms");
            }
            return await chai.request(app).post(`/rooms/update/${testId}`).send({
                "name": {"en": "Mando's Halls","de": "Garten der Träume"},
                "ipAddress": "213.101.20.71"
            }).then(async res => {

                chai.expect(res.status).to.equal(200);
                if (testId != null) {
                    await roomModule.deleteRoomById(testId)
                }
                if (testId1) {
                    await roomModule.deleteRoomById(testId1)
                }
            })

        })

        // Delete routes:

        it(`should return 200 and the deleted Room`, async () => {
            testId = await roomModule.createRoom({
                name: new Map<string, string>().set("en", "Doriath, Hall of Melian").set("de", "Melians Gemächer"),
                ipAddress: "18.228.44.145"
            });
            if (testId) {
                testRoom = await roomModule.getRoomById(testId)
            } else {
                printToConsole("Something went wrong creating the testRoom");
            }
            return await chai.request(app).delete(`/rooms/delete/${testId}`).then(res => {
                chai.expect(res.status).to.equal(200);
            })
        })
    })
}
