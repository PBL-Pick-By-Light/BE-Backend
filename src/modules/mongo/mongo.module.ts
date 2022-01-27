import * as mongoose from 'mongoose';
import {connect} from 'mongoose';
import {dbName} from "../../config/config.json";
import * as schemes from "../../models/index"
import {itemModel} from "../../models"
import {Label} from "../../models/label.model";
import {Item} from "../../models/item.model";
import {Position} from "../../models/position.model";
import {User} from "../../models/user.model";
import {Shelf} from "../../models/shelf.model";
import {Room} from "../../models/room.model";
import {Language} from "../../models/language.model";
import {printToConsole} from "../util/util.module";
import { Settings } from '../../models/settings.model';
import config from 'config'

/**
 * Basic functions for interacting with MongoDB
 */
export class MongoModule {

    /**
     * Connect to mongo database
     */
    async connectToMongo() {
        return connect(config.get('Database.mongoURL'), {dbName: dbName, serverSelectionTimeoutMS: 5000})
    }

    // Items

    /**
     * Add an item into the database. Used for creating new itemIds.
     * @param {Item} itemData
     * @return {mongoose.Types.ObjectId | null} itemId
     */
    async addItem(itemData: Item): Promise<mongoose.Types.ObjectId | null> {
        const item = new schemes.itemModel(itemData);
        const i = await item.save();
        return i._id
    }

    /**
     * Find an item by a specific filter. Used for finding a single item.
     * @param filter
     * @return {Item | null} item
     */
    async findItem(filter: any): Promise<Item | null> {
        return schemes.itemModel.findOne(filter);
    }

    /**
     * Find all items that are stored in the database.
     * @return {Item[]} items
     */
    async getItems(filter: any): Promise<Item[]> {
        return schemes.itemModel.find(filter);
    }

    /**
     * change properties of an item in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {Item} newItem
     * @return {Item|null} updated Item
     */
    async updateItem(id: mongoose.Types.ObjectId, newItem: Item): Promise<Item | null> {
        printToConsole("Label shiningId in Mongo module " + newItem.labelIds[0])
        return schemes.itemModel.findOneAndUpdate({_id: id}, {
            $set: {
                name: newItem.name,
                description: newItem.description,
                countable: newItem.countable,
                labelIds: newItem.labelIds
            }
        }, {new: true})
    }

    /**
     * Find labelIds that match a given item.
     * @param {mongoose.Types.ObjectId} id
     * @return {mongoose.Types.ObjectId[]} labelIds
     */
    async getItemLabelIds(id: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> {
        const item = await itemModel.findOne({_id: id});
        if (item?.labelIds) {
            printToConsole("Found item " + item + " will return shiningId")
            return item.labelIds
        } else {
            printToConsole("No item found")
            return []
        }
    }

    /**
     * Find labels that match a given item.
     * @param {mongoose.Types.ObjectId} id
     * @return {mongoose.Types.ObjectId[]} labels
     */

    async getItemLabels(id: mongoose.Types.ObjectId): Promise<Label[]> {
        const labelIds = await this.getItemLabelIds(id)
        let labels = [];
        if (labelIds) {
            for (const labelId of labelIds) {
                const label = await this.findLabel({_id: labelId})
                labels.push(label)
            }
        }
        // @ts-ignore because I removed all the null values, so now the type is just Label[]
        return labels.filter(label => label !== null)
    }

    /**
     * Remove an item from database
     * * @param {mongoose.Types.ObjectId} id
     * @return {mongoose.Types.ObjectId | null} labelId
     */
    async deleteItem(id: mongoose.Types.ObjectId): Promise<Item | null> {
        return schemes.itemModel.findByIdAndDelete({_id: id})
    }

    /**
     * Remove all items from database
     */
    async deleteAllItems() {
        return schemes.itemModel.deleteMany({})
    }

    // Labels



    /**
     * Add a label into the database. Used for creating new labelIds.
     * @param {Label} labelData
     * @return {mongoose.Types.ObjectId | null} labelId
     */
    async addLabel(labelData: Label): Promise<mongoose.Types.ObjectId | null> {
        let map: Map<string, string> = labelData.name
        let label
        printToConsole("labelData " + labelData)
        if (!labelData.colour) {
            printToConsole("just name ")
            label = new schemes.labelModel({name: map});
        } else {
            printToConsole("name and colour")
            label = new schemes.labelModel({name: map, colour: labelData.colour});
            printToConsole("label in mongomodule" + label)
        }
        let lab: Label | null = null
        try {
            lab = await label.save()
            printToConsole("saved " + lab)
            if (lab._id) {
                return lab._id
            }
        } catch (err: any) {
            printToConsole(err)
            return null;
        }
        return null;
    }


    /**
     * Find a label by a specific filter. Used for finding a single label.
     * @param filter
     * @return {Label | null} label
     */
    async findLabel(filter: any): Promise<Label | null> {
        return schemes.labelModel.findOne(filter);
    }

    // // Find multiple labelIds by a specific filter that match the given filter.
    // // Used for finding all labelIds that belong to one given item.
    // async getLabels(filter: any): Promise<Label[]> {
    //     return schemes.labelModel.find(filter);
    // }


    /**
     * Find all labels that are stored in the database.
     * @return {Label[]} labelIds
     */
    async getAllLabels(): Promise<Label[]> {
        return schemes.labelModel.find({});
    }


    /**
     * change properties of a label in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {String} newName
     * @param {String} newColour
     * @return {Label|null} updatedLabel
     */
    async updateLabel(id: mongoose.Types.ObjectId, newName: Map<string, string>, newColour: string): Promise<Label | null> {
        return schemes.labelModel.findOneAndUpdate({_id: id}, {
            $set: {
                name: newName,
                colour: newColour
            }
        }, {new: true})
    }


    /**
     * delete a label from database
     * @param {mongoose.Types.ObjectId} id
     * @return {Label|null} deletedLabel
     */
    async deleteLabel(id: mongoose.Types.ObjectId): Promise<Label | null> {
        return schemes.labelModel.findByIdAndDelete(id);
    }

    /**
     * Remove all labels from database
     */
    async deleteAllLabels() {
        return schemes.labelModel.deleteMany({})
    }

    // Positions

    /**
     * Add a position into the database. Used for creating new positions.
     * @param {Position} positionData
     * @return {mongoose.Types.ObjectId | null} position
     */
    async addPosition(positionData: Position): Promise<mongoose.Types.ObjectId | null> {
        const position = new schemes.positionModel(positionData);
        const pos = await position.save();
        return pos._id
    }

    /**
     * Find a position by a specific filter. Used for finding a single position.
     * @param filter
     * @return {Position | null} position
     */
    async findPosition(filter: any): Promise<Position | null> {
        return schemes.positionModel.findOne(filter);
    }

    /**
     * Find all positions that are stored in the database.
     * @return {Position[]} positions
     */
    async getPositions(filter: any): Promise<Position[]> {
        return schemes.positionModel.find(filter);
    }


    /**
     * Remove a position from database
     * @param {mongoose.Types.ObjectId} id
     * @return {Position|null} deleted position
     */
    async deletePositionById(id: mongoose.Types.ObjectId): Promise<Position | null> {
        return schemes.positionModel.findByIdAndDelete({_id: id})
    }

    /**
     * Remove all positions from database
     */
    async deleteAllPositions() {
        return schemes.positionModel.deleteMany({})
    }

    /**
     * change properties of a position in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {Position} updatedPosition
     * @return {Position|null} updated Position
     */
    async updatePositionById(id: mongoose.Types.ObjectId, updatedPosition: Position): Promise<Position | null> {
        return schemes.positionModel.findOneAndUpdate(
            {_id: id},
            {
                $set: {
                    itemId: updatedPosition.itemId,
                    number: updatedPosition.number,
                    shelfId: updatedPosition.shelfId,
                    quantity: updatedPosition.quantity
                }
            }, {new: true}
        )
    }

    //Users

    /**
     * Add an user into the database. Used for creating new users.
     * @param {User} userData
     * @return {mongoose.Types.ObjectId | null} userId
     */
    async addUser(userData: User): Promise<mongoose.Types.ObjectId | null> {
        const user = new schemes.userModel(userData);
        const usr = await user.save();
        return usr._id
    }

    /**
     * Find all Users that are stored in the database.
     * @return {User[]} users
     */
    async getUsers(): Promise<User[]> {
        return schemes.userModel.find({});
    }

    /**
     * Remove the jwt of a certain user.
     * @param {mongoose.Types.ObjectId} id
     * @return {User | null} user
     */
    async removeJWT(id: mongoose.Types.ObjectId): Promise<User|null>{
        return schemes.userModel.findOneAndUpdate({_id: id}, {jwt: ""}, {new: true})
    }

    /**
     * Remove an user from database
     * @param {mongoose.Types.ObjectId} id
     * @return {User | null} deleted user
     */
    async deleteUser(id: mongoose.Types.ObjectId){
        return schemes.userModel.findByIdAndDelete({_id: id});
    }

    /**
     * change properties of an user in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {User} newData
     * @return {User | null} updated user
     */

    async updateUser(id: mongoose.Types.ObjectId, newData: User): Promise<User | null> {
        return schemes.userModel.findOneAndUpdate({_id: id}, {
            $set: {
                name:	    newData.name,
                password:	newData.password,
                role:	    newData.role,
                jwt:        newData.jwt
            }
        }, {new: true})
    }


    /**
     * Remove all users from database
     */

    async deleteAllUsers() {
        return schemes.userModel.deleteMany({})
    }

    /**
     * Find a user by a specific filter. Used for finding a single user.
     * @param filter
     * @return {User | null} user
     */
    async findUser(filter: any): Promise<User | null> {
        return schemes.userModel.findOne(filter);
    }

    /**
     * Add a room into the database. Used for creating new rooms.
     * @param {Room} roomData
     * @return {mongoose.Types.ObjectId | null} roomId
     */
    async addRoom(roomData: Room): Promise<mongoose.Types.ObjectId | null> {
        const room = new schemes.roomModel(roomData)
        const newRoom = await room.save()
        return newRoom._id;
    }


    /**
     * Find all rooms that are stored in the database.
     * @return {Room[]} rooms
     */
    async getRooms(): Promise<Room[]> {
        return schemes.roomModel.find({})
    }


    /**
     * Find a single room by a specific filter.
     * @param filter
     * @return {Room | null}
     */
    async findRoom(filter: any): Promise<Room | null> {
        return schemes.roomModel.findOne(filter);
    }


    /**
     * change properties of a roomId in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {Room} newRoom
     * @return {Room|null} updatedRoom
     */
    async updateRoomById(id: mongoose.Types.ObjectId, newRoom: Room): Promise<Room | null> {
        return schemes.roomModel.findOneAndUpdate({_id: id}, {
            $set: {
                name: newRoom.name,
                ipAddress: newRoom.ipAddress
            }
        }, {new: true})
    }


    /**
     * delete a room from database
     * @param {mongoose.Types.ObjectId} id
     * @return {Room|null} deletedRoom
     */
    async deleteRoomById(id: mongoose.Types.ObjectId): Promise<Room | null> {
        return schemes.roomModel.findByIdAndDelete(id)
    }


    /**
     * Remove all rooms from database
     */
    async deleteAllRooms() {
        return schemes.roomModel.deleteMany({})
    }

    //Shelves

    /**
     * Add a shelf into the database. Used for creating new shelves.
     * @param {Shelf} shelfData
     * @return {mongoose.Types.ObjectId | null} shelfId
     */
    async addShelf(shelfData: Shelf): Promise<mongoose.Types.ObjectId | null> {
        const shelf = new schemes.shelfModel(shelfData);
        const newShelf = await shelf.save();
        return newShelf._id;
    }

    /**
     * Find all shelves that are stored in the database.
     * @return {Shelf[]} shelves
     */
    async getShelves(): Promise<Shelf[]> {
        return schemes.shelfModel.find({});
    }


    /**
     * Find a single shelf by a specific filter.
     * @param filter
     * @return {Shelf | null}
     */
    async findShelf(filter: any): Promise<Shelf | null> {
        return schemes.shelfModel.findOne(filter)
    }

    /**
     * change properties of a shelfId in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {Shelf} newData
     * @return {Shelf | null} updated Shelf
     */
    async updateShelfById(id: mongoose.Types.ObjectId, newData: Shelf): Promise<Shelf | null> {
        return schemes.shelfModel.findOneAndUpdate({_id: id}, {
            $set: {
                number: newData.number,
                roomId: newData.roomId
            }
        }, {new: true})
    }

    /**
     * delete a shelf from database
     * @param {mongoose.Types.ObjectId} id
     * @return {Room|null} deletedRoom
     */
    async deleteShelfById(id: mongoose.Types.ObjectId): Promise<Shelf | null> {
        return schemes.shelfModel.findByIdAndDelete(id)
    }

    /**
     * Remove all shelves from database
     */
    async deleteAllShelves() {
        return schemes.shelfModel.deleteMany({})
    }

    // Languages

    /**
     * Creates a new language and stores it in the database.
     * @param {Language} languageData the new language
     * @return {mongoose.Types.ObjectId}  the new language's id
     */

    async addLanguage(languageData: Language): Promise<mongoose.Types.ObjectId> {
        const language = new schemes.languageModel(languageData);
        const newLanguage = await language.save();
        return newLanguage._id;
    }

    /**
     * Finds all languages that are stored in the database.
     * @return {Language[]}
     */

    async getLanguages(): Promise<Language[]> {
        return schemes.languageModel.find();
    }

    /**
     * Finds all required languages that are stored in the database.
     * @return {Language[]}
     */

    async getRequired(): Promise<Language[]> {
        return schemes.languageModel.find({required: true});
    }

    /**
     * Finds a certain language by a specific filter.
     * @param filter
     * @return {Language}
     */

    async findLanguage(filter: any): Promise<Language | null> {
        return schemes.languageModel.findOne(filter);
    }

    /**
     * Changes properties of a certain language in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {Language} languageData language with updated properties
     * @return {Language} updated language
     */

    async updateLanguage(id: mongoose.Types.ObjectId, languageData: Language): Promise<Language | null> {
        return schemes.languageModel.findOneAndUpdate({_id: id}, {
            $set: {
                lang: languageData.lang,
                required: languageData.required
            }
        }, {new: true})
    }

    /**
     * Removes a language from database
     * @param {mongoose.Types.ObjectId} id
     * @return {Language} deleted language
     */

    async deleteLanguage(id: mongoose.Types.ObjectId): Promise<Language | null> {
        return schemes.languageModel.findByIdAndDelete({_id: id})
    }

    /**
     * Finds all settings that are stored in the database.
     * @return {[Settings]]}
     */

    async getSettings(): Promise<Settings | null> {
        return schemes.settingsModel.findOne({});
    }

    /**
     * Changes properties of settings in the database
     * @param {mongoose.Types.ObjectId} id
     * @param {[String]} colors List of ui colors 
     * @param {mongoose.Types.ObjectId} language selected language
     */

    async updateSettings(settings: Settings): Promise<Settings | null> {
        return schemes.settingsModel.findOneAndUpdate({ }, {
            $set: {
                colors: settings.colors,
                language: settings.language
            }
        }, {new: true})
    }

    /**
     * Add settings into the database
     * @param {Shelf} shelfData
     * @return {mongoose.Types.ObjectId | null} shelfId
     */

    async addSettings(settings: Settings): Promise<Boolean| null> {
        const setting = new schemes.settingsModel(settings);
        const newShelf = await setting.save();
        return newShelf._id;
    }
}
