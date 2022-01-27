// Models
import {ItemClass} from '../../models/item.model'
import {ShelfClass} from '../../models/shelf.model';
import {PositionClass} from '../../models/position.model';
import {SettingsClass} from '../../models/settings.model';
import {generateEnglishGermanMap, LanguageClass} from "../../models/language.model";

// Modules
import { MongoModule } from "../../modules/mongo/mongo.module";
import {LabelModule} from '../../modules/entities/label.module';
import {UserModule} from '../../modules/entities/user.module';
import {ItemModule} from '../../modules/entities/item.module';
import {ShelfModule} from '../../modules/entities/shelf.module';
import {PositionModule} from '../../modules/entities/position.module';
import {RoomModule} from "../../modules/entities/room.module";
import {LanguageModule} from "../../modules/entities/language.module";
import { SettingsModule } from '../../modules/entities/settings.module';

//Test-Data
import {labelSketches} from '../../tests/testdata/labels.json'
import {itemSketches} from '../../tests/testdata/items.json'
import {userSketches} from '../../tests/testdata/users.json'
import {shelveSketches} from '../../tests/testdata/shelves.json'
import {roomSketches} from '../../tests/testdata/rooms.json'
import {positionSketches} from '../../tests/testdata/positions.json'
import {languageSketches} from '../../tests/testdata/languages.json'
import {settingsSketch} from '../../tests/testdata/settings.json'
import { printToConsole } from '../../modules/util/util.module';

export class TestData {

    constructor(){

    }

    async addTestDataIfEmpty(exitWhenDone: boolean): Promise<void> {
        await this.countDocuments().then(async n => {
            console.log(`${n} Documents saved in database`);
            if (n == 0){
                console.log("Add Test Data");
                await this.addTestData(exitWhenDone);
            } else {
                console.log("No Test Data added");
                if (exitWhenDone) process.exit();
            }
        })
    }

    async countDocuments(): Promise<number> {
        const mongo: MongoModule = new MongoModule();
        var n: number = 0
        await mongo.connectToMongo().then(
            async mongoose => {
                const collections = mongoose.connection.collections
                for (const key in collections) {
                    const collection = collections[key]
                    await collection.countDocuments().then(
                        number => n += number
                    )
                }
            }
        )
        return n;
    }

    async addTestData(exitWhenDone: boolean) {
        const mongo: MongoModule = new MongoModule();

        mongo.connectToMongo().then(
            async _ => {

                const labelMod = new LabelModule(mongo);
                const userMod = new UserModule(mongo);
                const itemMod = new ItemModule(mongo);
                const shelfMod = new ShelfModule(mongo);
                const positionMod = new PositionModule(mongo);
                const roomMod = new RoomModule(mongo);
                const languageMod = new LanguageModule(mongo);
                const settingsMod = new SettingsModule(mongo);

                // Create labels
                for (const labelSketch of labelSketches) {
                    await labelMod.createLabel({
                        name: generateEnglishGermanMap(labelSketch.en, labelSketch.de),
                        colour: labelSketch.colour
                    })
                }

                //userSketches
                // creates userSketches from user.json
                for (const user of userSketches) {
                    await userMod.createUser(user)
                }

                //room
                // creates rooms using data from the rooms.json
                for (const roomSketch of roomSketches) {
                    await roomMod.createRoom({
                        name: generateEnglishGermanMap(roomSketch.en, roomSketch.de),
                        ipAddress: roomSketch.ipAddress
                    })
                }

                // shelf
                // creates shelves using existing rooms and the data from the shelves.json
                for (const shelfSketch of shelveSketches) {
                    const room = await mongo.findRoom({});
                    if (room?._id) {
                        await shelfMod.createShelf(new ShelfClass(room._id, shelfSketch.number))
                    }
                }


                // item
                // creates items using existing labelIds for their labelIds-attribute and the data from the items.json
                for (const itemSketch of itemSketches) {
                    const label1 = await mongo.findLabel({})
                    let label2
                    if (label1) {
                        label2 = await mongo.findLabel({_id: {$not: {$eq: label1._id}}})
                    }
                    if (label1?._id && label2?._id) {
                        await itemMod.createItem(new ItemClass(generateEnglishGermanMap(itemSketch.en, itemSketch.de), generateEnglishGermanMap(itemSketch.descriptionEn, itemSketch.descriptionDe), itemSketch.countable, [label1._id, label2._id]))
                    }
                }

                //position
                // creates positions using existing itemIds for their itemId-attribute, existing shelf._ids for their
                // shelfId-attribute and the data from the positions.json
                for (const positionSketch of positionSketches) {
                    const item = await mongo.findItem({})
                    const shelf = await mongo.findShelf({})
                    if (shelf?._id && item?._id) {
                        await positionMod.createPosition(new PositionClass(positionSketch.number, positionSketch.quantity, shelf._id, item._id))
                    }
                }

                //languages
                // creates languages
                for (const languageSketch of languageSketches) {
                    await languageMod.createLanguage(new LanguageClass(languageSketch.lang, languageSketch.required))
                }

                //settings
                // creates settings
                const lang = await mongo.findLanguage({})
                if (lang?._id)
                    await settingsMod.createSettings(new SettingsClass(settingsSketch.colors, lang._id))

            }).finally( () => {
                printToConsole("[+] Inserted Data to MongoDB");
                if (exitWhenDone) process.exit();
            })
    }

    async removeTestData() {
        const mongo: MongoModule = new MongoModule();
        mongo.connectToMongo().then(
            async mongoose => {
                const collections = mongoose.connection.collections
                for (const key in collections) {
                    const collection = collections[key]
                    // Settings cant be deleted, because it is a capped collection
                    // Drop Settings collection
                    if (collection.name == "settings"){
                        await collection.drop()
                    }
                    await collection.deleteMany({})
                        .catch(err => {
                            console.log(err)
                        })
                }
                console.log("[-] Removed all Data from MongoDB");
                process.exit();
            }
        ).catch(err => {
            console.log(err)
            process.exit();
        })
    }

}
