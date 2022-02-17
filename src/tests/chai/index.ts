import {app} from '../../index';
import chai from 'chai';
import chaiHttp from 'chai-http'
import { itemTest } from './item.test';
import { positiontest } from './position.test';
import { shelftest } from './shelf.test';
import { roomTest } from './room.test';
import {labelTest} from "./label.test";
import {languageTest} from "./language.test";
import {userTest} from "./user.test";
import {authTest} from "./auth.test";

chai.use(chaiHttp)

// Test base route to return string
describe('Base Route Test', () => {
    const returnString: String = 'This is the pbl-backend project!'
    it(`should return ${returnString}`, () => {
        return chai.request(app).get('/')
            .then(res => {
                chai.expect(res.text).to.equal(returnString)
            })
    })
})

roomTest()
shelftest()
labelTest()
positiontest()
itemTest()
userTest()
authTest()
// languageTest() uses language "en" that is hardcoded into the database when running script 'addData'
// make sure it actually is in the database, otherwise some tests will fail
languageTest()
