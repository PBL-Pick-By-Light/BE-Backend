import {app} from '../../index';
import chai from 'chai';
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import {Label, LabelClass} from "../../models/label.model";
import {ItemClass} from "../../models/item.model";
import {generateEnglishGermanMap} from "../../models/language.model";
import {printToConsole} from "../../modules/util/util.module";
import { ItemModule } from '../../modules/entities/item.module';
import { MongoModule } from '../../modules/mongo/mongo.module';
import { LabelModule } from '../../modules/entities/label.module';

chai.use(chaiHttp);

export async function labelTest() {

    let testId: mongoose.Types.ObjectId | null;
    let testName: Map<string, string>;
    let testItemId: mongoose.Types.ObjectId | null;
    let testLabel: Label | null;
    const mongoModule: MongoModule = new MongoModule();
    const itemModule: ItemModule = new ItemModule(mongoModule);
    const labelModule: LabelModule = new LabelModule(mongoModule);

    describe('Label Route Tests', async () => {

        // Create routes:

        // Create a new label without color
        it(`should return 201 and id of created label (label without colour)`, async () => {
            return await chai.request(app).post('/labels/create').send({
                name: {"en":"silver", "de":"Silber"}
            }).then(async res => {

                chai.expect(res.status).to.equal(201);
                chai.expect(res.body).to.exist
                await labelModule.deleteLabel(res.body)
            })
        })

        // Create labels with color
//
        it(`should return 201 and id of created label`, async () => {
            return await chai.request(app).post('/labels/create').send({
                name: {"en":"bloodred", "de":"blutrot"},
                colour: "#bb0a1e"
            }).then(async res => {

                chai.expect(res.status).to.equal(201);
                chai.expect(res.body).to.exist
                await labelModule.deleteLabel(res.body)
            })
        })
//
        // Create - Bad Request due to empty name.
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/labels/create').send({
                "name": "",
                "colour": "#fb0afe"
            }).then(res => {

                chai.expect(res.status).to.equal(400);
            })
        })
//
        // Create - Bad Request due to empty name. - Without colour

        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/labels/create').send({
                "name": ""
            }).then(res => {

                chai.expect(res.status).to.equal(400);
            })
        })
//
        // Create - Bad Request due to invalid HexCodeForColour
        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/labels/create').send({
                name: {"en":"invalidHexCodeForColor", "de":"ungültigerHexWert"},
                colour: "#zzii11"
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })

//        // Create - Internal Server Error due to duplicate name
//        it("should return 500 and message", async () => {
//            const map = new Map<string, string>().set("en", "duplikate").set("de", "duplikat")
//            testId = await labelModule.createLabel({name: map})
//            return await chai.request(app).post("/labels/create").send({name: {"en": "duplikate","de":"duplikat"}})
//                .then(async res => {
//                    chai.expect(res.status).to.equal(500)
//                    if (testId) {
//                        await labelModule.deleteLabel(testId)
//                    }
//                })
//        })
//
//       // Create - Internal Server Error due to duplicate colour
//       it("should return 500 and message", async () => {
//           testId = await labelModule.createLabel({
//               name: generateEnglishGermanMap("doubleColour", "doppelteFarbe"),
//              colour: "#555555"
//           })
//           return await chai.request(app).post("/labels/create").send({
//               name: {"en":"doubColour", "de":"doppFarbe"},
//               colour: "#555555"
//           })
//               .then(async res => {
//                   chai.expect(res.status).to.equal(500)
//                   if (testId) {
//                       await labelModule.deleteLabel(testId)
//                   }
//               })
//       })

        // Read routes:

        it(`should return 200 and all labels`, async () => {
            return await chai.request(app).get('/labels/getAll').then(res => {
                chai.expect(res.status).to.equal(200);
            })
        })

        it(`should return 200 and the correct label`, async () => {
            let map = generateEnglishGermanMap("made by Narvi", "geschmiedet von Narvi")
            testId = await labelModule.createLabel({name: map, colour: "#454545"})
            return await chai.request(app).get(`/labels/findById/${testId}`).then(async res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.id = testId);
                //  to avoid duplicates, delete Label after test has finished
                if (testId) {
                    await labelModule.deleteLabel(testId)
                }
            })
        })
//
        //  it(`should return 200 and the correct label`, async () => {
        //      testName = generateEnglishGermanMap("galvorn","galvorn")
        //       testId = await labelModule.createLabel({name: testName})
        //      return await chai.request(app).get(`/labels/findByName/${testName}`).send({}).then(async res => {
        //          chai.expect(res.status).to.equal(200);
        //          chai.expect(res.body.name = testName);
        //          if (testId) {
        //              await labelModule.deleteLabel(testId)
        //          }
        //      })
        //  })
//
        it(`should return 200 and the correct labelids`, async () => {
            testName = generateEnglishGermanMap("mithril", "mithril")
            testId = await labelModule.createLabel({name: testName, colour: "#3339ff"})
            if (testId) {
                let map = generateEnglishGermanMap("Frodo's Chainmail", "Frodos Kettenhemd")
                let map1 = generateEnglishGermanMap("astonishingly strong - and glittering!", "hält Waffen ab")
                testItemId = await itemModule.createItem(new ItemClass(map, map1, false, [testId]))
            }
            return await chai.request(app).get(`/labels/findIdsByItemId/${testItemId}`).then(async res => {
                chai.expect(res.status).to.equal(200);
                if (testItemId) {
                    await itemModule.deleteItemById(testItemId)
                }
                if (testId) {
                    await labelModule.deleteLabel(testId)
                }
            })
        })

        it(`should return 200 and the correct labels`, async () => {

            testId = await labelModule.createLabel(new LabelClass(generateEnglishGermanMap("spear", "Speer"), "#677666"))
            let testId1 = await labelModule.createLabel(new LabelClass(generateEnglishGermanMap("made by Ivaldi and sons", "von Ivaldi und Söhnen geschmiedet")))
            if (testId1 && testId) {
                let map = generateEnglishGermanMap("Gungir", "Gungir")
                let map1 = generateEnglishGermanMap("a terrifying spear that will never miss its target", "Odins Waffe")
                testItemId = await itemModule.createItem(new ItemClass(
                    map,
                    map1,
                    true,
                    [testId1, testId]))
            } else {
                printToConsole("something went wrong creating testids!")
            }
            if (!testItemId) {
                printToConsole("Something went wrong creating the testItem(Id)!")
            }
            return await chai.request(app).get(`/labels/findByItemId/${testItemId}`).send({}).then(async res => {
                chai.expect(res.status).to.equal(200);
                if (testId) {
                    await labelModule.deleteLabel(testId)
                }
                if (testId1) {
                    await labelModule.deleteLabel(testId1)
                }
            })
        })
//
        //    // Update routes:
//
        //    // Update with a single reference to a label
//
        it(`should return 200 and the updated label`, async () => {
            testLabel = new LabelClass(new Map<string, string>().set("en", "made by Maeglin").set("de", "von Maeglin geschmiedet"), "#000000")
            testId = await labelModule.mongo.addLabel(testLabel)
            if (!testId) {
                printToConsole("Something went wrong creating the testlabel")
            }
            return await chai.request(app).post(`/labels/update/${testId}`).send({
                "name": {"en":"made by Celebrimbor","de":"von Celebrimbor geschmiedet"},
                "colour": "#2b0222"
            }).then(async res => {

                chai.expect(res.status).to.equal(200);
                chai.expect(res.body.name.en).to.equal("made by Celebrimbor")
                if (testId) {
                    await labelModule.deleteLabel(testId)
                }
            })
        })

        //    // Update without color (FE makes sure, there are only colorfree-updates if the
        //     // labels itself has no color right now) to labels

        it(`should return 200 and the updated label`, async () => {
            testId = await labelModule.createLabel({
                name: new Map<string, string>().set("en", "made by Feanaro").set("de", "von Feanor geschaffen"),
                colour: "#990000"
            })
            if (!testId) {
                printToConsole("Something went wrong creating the testlabel")
            }
            return await chai.request(app).post(`/labels/update/${testId}`).send({
                name: {"en": "made by Feanor","de":"von Feanor geschaffen"},
                colour: ""
            }).then(async res => {

                chai.expect(res.status).to.equal(200);
                if (testId != null) {
                    await labelModule.deleteLabel(testId)
                }
            })
        })
//
        //   // Update - Bad Request due to empty name.
//
        it(`should return 400 and text 'Bad Request'`, async () => {
            testId = await labelModule.createLabel({
                name: new Map<string, string>().set("en", "touched by the power of Melian").set("de", "von Melain verzaubert"),
                colour: "#005500"
            })
            if (!testId) {
                printToConsole("Something went wrong creating the testlabel")
            }
            return await chai.request(app).post(`/labels/update/${testId}`).send({
                "name": "",
                "colour": "#ffaa11"
            }).then(async res => {

                chai.expect(res.status).to.equal(400);
                if (testId) {
                    await labelModule.deleteLabel(testId)
                }
            })
        })


        //    // Update - Bad Request due to invalid color.
//
        it(`should return 400 and text 'Bad Request'`, async () => {
            testId = await labelModule.createLabel({
                name: new Map<string, string>().set("en", "cursed").set("de", "verflucht"),
                colour: "#998855"
            })
            if (!testId) {
                printToConsole("Something went wrong creating the testlabel")
            }
            return await chai.request(app).post(`/labels/update/${testId}`).send({
                "name": {"en": "cursed","de":"verflucht"},
                "colour": "#wfaaw1"
            }).then(async res => {
                chai.expect(res.status).to.equal(400)
                if (testId) {
                    await labelModule.deleteLabel(testId)
                }
            })
        })

       // // Delete routes:
//
        it(`should return 200 and the deleted label`, async () => {
            testId = await labelModule.createLabel(new LabelClass(new Map<string, string>().set("en", "made by Narvi").set("de", "von Narvi geschaffen"), "#223244"));
            if (testId) {
                testLabel = await labelModule.findLabelById(testId)
            } else {
                printToConsole("Something went wrong creating the testlabel")
            }
            return await chai.request(app).delete(`/labels/delete/${testId}`).then(res => {
                chai.expect(res.status).to.equal(200);
            })
        })
    })

}
