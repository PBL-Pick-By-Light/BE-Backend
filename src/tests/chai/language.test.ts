import {app} from '../../index';
import chai from 'chai';
import chaiHttp from "chai-http";
import * as mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";

chai.use(chaiHttp);
chai.expect;

export function languageTest() {

    let languageId: mongoose.Types.ObjectId;
    let englishId: mongoose.Types.ObjectId;
    let languageName: string;

    describe('Language Route Tests', async () => {

        // Create routes:

        it(`should return 201 and id of created language`, async () => {
            return await chai.request(app).post('/languages/create').send({
                "lang": "it"
            }).then(res => {
                languageId = res.body;
                printToConsole(languageId);
                chai.expect(res.status).to.equal(201);
            })
        })

        // Internal Server Error due to creation of another language with the same name like the one before.

        it(`should return 500 and text 'Internal Server Error`, async () => {
            return await chai.request(app).post('/languages/create').send({
                "lang": "it"
            }).then(res => {
                chai.expect(res.status).to.equal(500);
            })
        })

        // Bad Request due to empty name.

        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post('/languages/create').send({
                "lang": ""
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })

        // Read routes:

        it(`should return 200 and all languages`, async () => {
            return await chai.request(app).get('/languages/getAll').then(res => {
                chai.expect(res.status).to.equal(200);
            })
        })

        // Find a language by its id.

        it(`should return 200 and the correct item`, async () => {
            return await chai.request(app).get(`/languages/findById/${languageId}`).then(res => {
                languageName = res.body.lang;
                printToConsole(languageName);
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(languageId);
            })
        })

        // Find a language by its name.

        it(`should return 200 and the correct item`, async () => {
            printToConsole(languageName);
            return await chai.request(app).get(`/languages/findByName/${languageName}`).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(languageId);
                chai.expect(res.body.lang).to.equal(languageName);
            })
        })

        // Update routes:

        it(`should return 200 and the updated item`, async () => {
            return await chai.request(app).post(`/languages/update/${languageId}`).send({
                "lang": "fr"
            }).then(res => {
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(languageId);
            })
        })

        // Update - Forbidden due to attempt to rename language English.

        it(`should return 403 and text 'Forbidden'`, async () => {
            await chai.request(app).get('/languages/findByName/en').then(res => {
                printToConsole(res.body)
                englishId = res.body._id;
                printToConsole("EnglishId: " + englishId);
            })
            return await chai.request(app).post(`/languages/update/${englishId}`).send({
                "lang": "ja"
            }).then(res => {
                chai.expect(res.status).to.equal(403);
            })
        })

        // Update - Bad Request due to empty name.

        it(`should return 400 and text 'Bad Request'`, async () => {
            return await chai.request(app).post(`/languages/update/${languageId}`).send({
                "lang": ""
            }).then(res => {
                chai.expect(res.status).to.equal(400);
            })
        })

        // Delete routes:

        it(`should return 200 and the deleted language`, async () => {
            return await chai.request(app).delete(`/languages/delete/${languageId}`).then(res => {
                printToConsole("id\n" + languageId);
                printToConsole(res.status);
                chai.expect(res.status).to.equal(200);
                chai.expect(res.body._id).to.equal(languageId);
            })
        })

        // Delete - Forbidden due to attempt to remove language English

        it(`should return 403 and text 'Forbidden'`, async () => {
            await chai.request(app).get('/languages/findByName/en').then(res => {
                printToConsole(res.body);
                englishId = res.body._id;
                printToConsole("EnglishId: " + englishId);
            })
            return await chai.request(app).delete(`/languages/delete/${englishId}`).then(res => {
                chai.expect(res.status).to.equal(403);
            })
        })

    })
}
