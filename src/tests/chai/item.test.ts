import {app} from '../../index';
import chai from 'chai';
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import {generateEnglishGermanMap} from "../../models/language.model";
import {printToConsole} from "../../modules/util/util.module";
import { PositionModule } from '../../modules/entities/position.module';
import { MongoModule } from '../../modules/mongo/mongo.module';
import { RoomModule } from '../../modules/entities/room.module';
import { ShelfModule } from '../../modules/entities/shelf.module';

chai.use(chaiHttp);
chai.expect;

export async function itemTest() {

    let itemId: string;
    let labelId1: string;
    let labelId2: string;
    const mongoModule: MongoModule = new MongoModule();
    const positionModule: PositionModule = new PositionModule(mongoModule);
    const roomModule: RoomModule = new RoomModule(mongoModule);
    const shelfModule: ShelfModule = new ShelfModule(mongoModule);

    describe('Item Route Tests', async () => {

        // Create routes:

        // Create with a single reference to a label

        it(`should return 201 and id of created item`, async () => {
            await chai.request(app).post('/labels/create').send({
                "name": {"en": "test", "de": "test"},
                "colour": "#f11f1f"
            }).then(res => {
                labelId2 = res.body;
                printToConsole("Id hier" + JSON.stringify(labelId2) + " " + labelId2);
            });
            //let mapTwo: Map<string, string> = new Map<string, string>().set("en", "testLabel2").set("de", "testTag 2")
            await chai.request(app).post('/labels/create').send({
                "name": {"en": "testLabel2", "de": "testTag 2"}
            }).then(res => {
                printToConsole(res.body)
                labelId1 = res.body;
                printToConsole("Id hier" + JSON.stringify(labelId1) + " " + labelId1);
            });

            return await chai.request(app).post('/items/create').send({
                "name": {"en": "board","de": "Brett"},
                "description": {"en": "wooden Board","de":"aus Holz"},
                "countable": false,
                "labelIds": []
            }).then(res => {
                itemId = res.body;
                printToConsole("Body " + itemId)
                chai.expect(res.status).to.equal(201);
            })
        })
//
        //    // Create with multiple references to labels
//
        it(`should return 201 and id of created item`, async () => {
            return await chai.request(app).post('/items/create').send({
                "name": {"en": "screwy","de":"Schraubi"},
                "description": {"en": "one Screw with strange Head","de": "Eine Schraube mit Senkkopf"},
                "countable": false,
                "labelIds": []
            }).then(res => {
                chai.expect(res.status).to.equal(201);
            })
        })
//
        //    // Create without any references to labels
//
        it(`should return 201 and id of created item`, async () => {
            return chai.request(app).post('/items/create').send({
                "name": {"de" :"Arduino 30", "en": "Arduino 30"},
                "description": {"de":"Mikrokontroller","en":"Microcontroller"},
                "countable": false,
                "labelIds": []
            }).then(res => {
                chai.expect(res.status).to.equal(201);
            })
        })
//
        //    // Create - Bad Request due to empty name.
//
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/items/create').send({
                "name": {},
                "description": {"en":"I don't have a name","de": "hab keinen Namen"},//toJson(generateEnglishGermanMap("I don't have a name", "hab keinen Namen")),
                "countable": false,
                "labelIds": new Array<string>(labelId1, labelId2)
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })
//
        //    // Create - Bad Request due to empty description.
//
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/items/create').send({
                "name": {"en":"Item without Description", "de":"Item ohne Beschreibung"},
                "description": "",
                "countable": false,
                "labelIds": [labelId2]
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })
//
        //  //    // Read routes:
////
        it(`should return 200 and all items`, async () => {
            return await chai.request(app).get('/items/getAll').then(res => {
                chai.expect(res.status).to.equal(200);
            })
        })
////
        it(`should return 200 and the correct item`, async () => {
            const roomId = await roomModule.createRoom({
                name: generateEnglishGermanMap("roomafdssdfa", "Raumafddsdsa"),
                ipAddress: "90.186.119.142 "
            })
            let shelfId: mongoose.Types.ObjectId | null;
            let positionId: mongoose.Types.ObjectId | null;
            if (roomId) {
                shelfId = await shelfModule.createShelf({number: 1, "roomId": roomId})
                if (shelfId && itemId) {
                    positionId = await positionModule.createPosition({
                        number: 2,
                        quantity: 2,
                        shelfId: shelfId,
                        itemId: new mongoose.Types.ObjectId(itemId)
                    })
                } else {
                    printToConsole("Fehler beim erstellen von shelf oder itemid")
                }
            } else {
                printToConsole("Fehler beim erstellen von roomId")
            }
            return await chai.request(app).get(`/items/findById/${itemId}`).then(async res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(itemId);
                if (roomId) {
                    await roomModule.deleteRoomById(roomId)
                }
                if (shelfId) {
                    await shelfModule.deleteShelfById(shelfId)
                }
                if (positionId) {
                    await positionModule.deletePositionById(positionId)
                }
            })
        })
////
        //  //    // Find an item by one given label
////
        it(`should return 200 and the correct items`, async () => {
            printToConsole([labelId1]);
            return await chai.request(app).post('/items/findByLabel').send({
                "labelIds": [labelId1]
            }).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.labelIds = [labelId1]);
            })
        })
////
        //  //    // Find an item by multiple given labels
////
        it(`should return 200 and the correct items`, async () => {
            return await chai.request(app).post('/items/findByLabel').send({
                "labelIds": [labelId1, labelId2]
            }).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.labelIds = [labelId1, labelId2]);
            })
        })
////
        //  //    // Find an item by multiple given labels that are the same labels like before but in a different order
////
        it(`should return 200 and the correct items`, async () => {
            return await chai.request(app).post('/items/findByLabel').send({
                "labelIds": [labelId2, labelId1]
            }).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.labelIds = [labelId1, labelId2]);
            })
        })
//////
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post(`/items/findByLabel`).send({
                "labelIds": []
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })
//
        //  // Update routes:
//
        //  // Update with a single reference to a label
//
        it(`should return 200 and the updated item`, async () => {
            return await chai.request(app).post(`/items/update/${itemId}`).send({
                "name": {"en":"Darkball", "de":"Finsterball"} ,
                "description": {"en":"strange dark Pokèball", "de":"Ein mysteriöser Ball, geeignet für Einsätze in der Nacht oder an dunklen Orten."},
                "countable": true,
                "labelIds": [labelId1]
            }).then(res => {
                printToConsole(res.body)
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(itemId);
            })
        })
////
        //  //   // Update with multiple references to labels
////
        it(`should return 200 and the updated item`, async () => {
            return await chai.request(app).post(`/items/update/${itemId}`).send({
                "name": {"en":"Masterball", "de":"Meisterball"},
                "description": {"en":"Great Pokèball","de": "Mit dem Meisterball fängst du jedes Pokémon beim ersten Versuch."},
                "countable": true,
                "labelIds": [labelId1, labelId2]
            }).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(itemId);
            })
        })
////
        //  //   // Update without any references to labels
////
        it(`should return 200 and the updated item`, async () => {
            return await chai.request(app).post(`/items/update/${itemId}`).send({
                "name": {"en":"Quickball", "de":"Flottball"},
                "description": {"en":"strange Pokéball", "de":"Ein ungewöhnlicher Ball, der zu Beginn des Kampfes am wirkungsvollsten ist."},
                "countable": true,
                "labelIds": []
            }).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(itemId);
            })
        })
////
        //  //    // Update - Bad Request due to empty name.
////
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post(`/items/update/${itemId}`).send({
                "name": "",
                "description": {"en":"I don't have a name", "de":"habe keinen Namen"},//generateEnglishGermanMap("I don't have a name", "habe keinen Namen"),
                "countable": false,
                "labelIds": []
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })
//
        //  // Update - Bad Request due to empty description.
//
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post(`/items/update/${itemId}`).send({
                "name": {"en":"ItemWithoutDescription", "de":"keine Beschreibung"},//generateEnglishGermanMap("ItemWithoutDescription", "keine Beschreibung"),
                "description": "",
                "countable": false,
                "labelIds": []
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })
//
        ////    // Delete routes:
//
        it(`should return 200 and the deleted item`, async () => {
            return await chai.request(app).delete(`/items/delete/${itemId}`).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(itemId);
            })
        })
//
        it('labelDeletion\n', async () => {
            return await chai.request(app).delete(`/labels/delete/${labelId1}`).then(res => {
                chai.expect(res.status).to.equal(200)
                chai.expect(res.body._id).to.equal(`${labelId1}`)
            });
        })

        it('labelDeletion\n', async () => {
            printToConsole(labelId2)
            return await chai.request(app).delete(`/labels/delete/${labelId2}`).then(res => {
                chai.expect(res.status).to.equal(200)
                chai.expect(res.body._id).to.equal(`${labelId2}`)
            });
        })
    })
}
