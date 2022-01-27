import {app} from '../../index'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {printToConsole} from "../../modules/util/util.module";
chai.use(chaiHttp)


export async function lightTest() {

    describe('light Route Tests', () => {

        let itemId : string

        //create itemId test
        it(`itemCreation`, async () => {
            return await chai.request(app).post('/items/create')
                .send({
                    "name": {"en":"motion sensor", "de":"Bewegungssensor"},
                    "description": {"en":"width 2m", "de":"Breite 2m"},
                    "countable": true,
                    "labelIds": []
                })
                .then(res => {
                    chai.expect(res.status).to.equal(201)
                    itemId = res.text.replace(new RegExp("\"", 'g'), "");
                    printToConsole("itemId:" + itemId);
                    chai.expect(res.body).to.exist
                })
        })

        //Test light/turnOn should return 200
        it(`light:turnOn`, async () => {
            return await chai.request(app).post('/light/turnOn')
                .send({
                    "itemId": itemId,
                    "color": "#Fa127E",
                    "duration": 3
                })
                .then(async res => {
                    chai.expect(res.status).to.equal(200);
                })
        })
    })
}

