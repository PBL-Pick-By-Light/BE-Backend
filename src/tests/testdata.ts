import {MongoModule} from '../modules/mongo/mongo.module';
import config from 'config'
import {printToConsole} from"../modules/util/util.module";

// Models
import {ItemClass} from '../models/item.model'
import {ShelfClass} from '../models/shelf.model';
import {PositionClass} from '../models/position.model';
import {generateEnglishGermanMap, LanguageClass} from "../models/language.model";

// Modules
import {LabelModule} from '../modules/entities/label.module';
import {ItemModule} from '../modules/entities/item.module';
import {UserModule} from '../modules/entities/user.module';
import {ShelfModule} from '../modules/entities/shelf.module';
import {PositionModule} from '../modules/entities/position.module';
import {RoomModule} from "../modules/entities/room.module";
import {LanguageModule} from "../modules/entities/language.module";

//Test-Data
import {labelSketches} from '../tests/testdata/labels.json'
import {itemSketches} from '../tests/testdata/items.json'
import {userSketches} from '../tests/testdata/users.json'
import {shelveSketches} from '../tests/testdata/shelves.json'
import {roomSketches} from '../tests/testdata/rooms.json'
import {positionSketches} from '../tests/testdata/positions.json'
import {languageSketches} from '../tests/testdata/languages.json'

/**
 * loads some testdata into the DB
 */
export class TestData {
    mongo: MongoModule
    label: LabelModule
    item: ItemModule
    user: UserModule
    shelf: ShelfModule
    room: RoomModule
    position: PositionModule
    language: LanguageModule

    constructor(mongo: MongoModule) {
        this.mongo = mongo
        this.label = new LabelModule(mongo)
        this.item = new ItemModule(mongo)
        this.user = new UserModule(mongo)
        this.shelf = new ShelfModule(mongo)
        this.room = new RoomModule(mongo)
        this.position = new PositionModule(mongo)
        this.language = new LanguageModule(mongo)
    }

    /**
     * Remove all data from DB
      */
    public removeTestData() {
        this.mongo.connectToMongo().then(
            async mongoose => {
                const collections = mongoose.connection.collections
                for (const key in collections) {
                    const collection = collections[key]
                    await collection.deleteMany({})
                }
                console.log("[-] Removed all Data from MongoDB");
            }
        )
    }

    /**
     * Add some Testdata into DB
     */
    public async addTestData() {
        this.mongo.connectToMongo().then(
            async mongoose => {
                console.log(`Connected to MongoDB at ${config.get('Database.mongoURl')}, database: ${mongoose.connection.db.databaseName}\n`);


                // Create labels
                for (const labelSketch of labelSketches) {
                    if (!labelSketch.colour) {
                        await this.label.createLabel({name: generateEnglishGermanMap(labelSketch.en, labelSketch.de)});
                    } else {
                        await this.label.createLabel({
                            name: generateEnglishGermanMap(labelSketch.en, labelSketch.de),
                            colour: labelSketch.colour
                        })
                    }
                }

                //users
                // creates users from user.json
                for (const user of userSketches) {
                    await this.user.createUser(user)
                }

                //room
                // creates rooms using data from the rooms.json
                for (const roomSketch of roomSketches) {
                    await this.room.createRoom({
                        name: generateEnglishGermanMap(roomSketch.en, roomSketch.de),
                        ipAddress: roomSketch.ipAddress
                    })
                }

                // shelf
                // creates shelves using existing rooms and the data from the shelves.json
                for (const shelfSketch of shelveSketches) {
                    const room = await this.mongo.findRoom({});
                    if (room?._id) {
                        await this.shelf.createShelf(new ShelfClass(room._id, shelfSketch.number))
                    }
                }


                // item
                // creates items using existing labelIds for their labelIds-attribute and the data from the items.json
                for (const itemSketch of itemSketches) {
                    const label1 = await this.mongo.findLabel({})
                    let label2
                    if (label1) {
                        label2 = await this.mongo.findLabel({_id: {$not: {$eq: label1._id}}})
                    }
                    if (label1?._id && label2?._id) {
                        await this.item.createItem(new ItemClass(generateEnglishGermanMap(itemSketch.en, itemSketch.de), generateEnglishGermanMap(itemSketch.descriptionEn, itemSketch.descriptionDe), itemSketch.countable, [label1._id, label2._id]))
                    }
                }

                //position
                // creates positions using existing itemIds for their itemId-attribute, existing shelf._ids for their
                // shelfId-attribute and the data from the positions.json
                for (const positionSketch of positionSketches) {
                    const item = await this.mongo.findItem({})
                    const shelf = await this.mongo.findShelf({})
                    if (shelf?._id && item?._id) {
                        await this.position.createPosition(new PositionClass(positionSketch.number, positionSketch.quantity, shelf._id, item._id))
                    }
                }

                //languages
                // creates languages
                for (const languageSketch of languageSketches) {
                    await this.language.createLanguage(new LanguageClass(languageSketch.lang, languageSketch.required))
                }

            })
    }

    /**
     * Add some Testdata into DB
     */
    public async addESTestData() {
        /// CREATE CHAIN OF ROOM <- SHELF <- POSITION -> ITEM
        // for tests with ES
        let esLabelId = await this.label.createLabel({
            name : new Map<string, string>().set("en","ES_TEST").set("de", "ES_TEST")
        })
        let esItemId;
        let esShelfId;
        let esRoomId = await this.room.createRoom({
            name: new Map<string, string>().set("en", "ES_TEST_ROOM").set("de", "ES_TEST_RAUM"),
            ipAddress: "192.168.1.131"
        })
        if(esRoomId) {
            esShelfId = await this.shelf.createShelf({
                number: 2,
                roomId: esRoomId
            })
        }
        if(esLabelId){
            esItemId = await this.item.createItem({
                name : new Map<string, string>().set("en", "ES_TEST_ITEM").set( "de","ES_TEST_GEGENSTAND"),
                description : new Map<string, string>().set("en", "FOR TESTS INVOLIVING ES").set("de","für Tests mit ES"),
                countable : true,
                labelIds : [esLabelId]
            })
        }
        if(esShelfId && esItemId) {
            await this.position.createPosition({
                itemId: esItemId,
                number: 4,
                quantity: 2,
                shelfId: esShelfId
            })
            if (esShelfId && esItemId) {
                await this.position.createPosition({
                    itemId: esItemId,
                    number: 8,
                    quantity: 2,
                    shelfId: esShelfId
                })
            }
        }

        if (esItemId) {
            console.log("\n********\n ES TEST ITEM ID IS\n" + esItemId + "\n**********")
        } else {
            console.log("\n********\n ES TEST ITEM ID CREATION FAILED\n**********")
        }

    }
}
