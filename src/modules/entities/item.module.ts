import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Item} from "../../models/item.model";
import {Position} from "../../models/position.model";
import {printToConsole} from "../../modules/util/util.module";
import mongoose from "mongoose";

/**
 * Module for items, providing all item functionalities
 *     for item controller using methods of mongo module.
 */

export class ItemModule extends EntityModule {
    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * Creates a new item
     * @param {Item} itemData an Item that holds all needed attributes
     * @return {Promise<mongoose.Types.ObjectId| null>} a Promise that will deliver either the item's id or null, in case the creation failed
     */

    async createItem(itemData: Item): Promise<mongoose.Types.ObjectId | null> {
        const itemId: mongoose.Types.ObjectId | null = await this.mongo.addItem(itemData)
        printToConsole('[+] New item with id ' + itemId + ' saved.');
        if (itemId) {
            return itemId
        } else {
            return null
        }
    }

    /**
     * Gets an Item by its id
     * @param {mongoose.Types.ObjectId} id id of the Item that is to be found
     * @returns {Promise<Item|null>} a Promise that will deliver either the Item or null, in case it couldn't be found in the database
     */

    async getItemById(id: mongoose.Types.ObjectId): Promise<Item | null> {
        return this.mongo.findItem({_id: id}).then((item) => {
            printToConsole(item);
            return item;
        }).catch((err: any) => {
            printToConsole(err);
            return null;
        });
    }


    /**
     // Gets an Item by its labels
     // params: Label[] labels: labels of the Item that is to be found
     // returns: Promise<Item|null> : a Promise that will deliver either the Item or null, in case it couldn't be found in the database
     */
    async getItemByLabels(labelIds: mongoose.Types.ObjectId[]): Promise<Item[] | null> {
        printToConsole("Labelids in item.module: " + labelIds)
        let items = await this.mongo.getItems({labelIds: {$elemMatch: {$eq: new mongoose.Types.ObjectId(labelIds[0])}}})
        printToConsole("Search in: " + items)
        for (let i = 1; i < labelIds.length; i++) {
            items = items.filter(item => item.labelIds.includes(labelIds[i]))
            printToConsole("remaining: " + items)
        }
        printToConsole(items);
        return items;
    }


    /**
     * Gets an item's Position by the item's id
     * @param {mongoose.Types.ObjectId} id id of the Item that is to be found
     * @return {Promise<Position|null>} a Promise that will deliver either the Position or null, in case it couldn't be found in the database
     */

    async getItemPositionByItemId(id: mongoose.Types.ObjectId): Promise<Position | null> {
        this.mongo.findItem({_id: id}).then((item) => {
            return this.mongo.findPosition({item: item}).then((position) => {
                printToConsole(`Position of an item ${item?.name} with ID: ${item?._id} at: ${position}`);
                return position;
            }).catch(err => {
                printToConsole(err)
            })
        }).catch((err) => {
            printToConsole(err);
            return null;
        });
        return null;
    }

    /**
     * Gets all countable items
     * @param {ItemClass} item
     * @return {Promise<Item|null>} a Promise that will deliver either the Item or null, in case it couldn't be found in the database
     */

    async getAllCountableItems(): Promise<Item[] | null> {
        return this.mongo.getItems({countable: true}).then(items => {
            items.forEach((item: Item) => {
                printToConsole(item);
            });
            return items;
        }).catch(err => {
            printToConsole(err);
            return null;
        })
    }

    /**
     * Gets all items
     * @return {Promise<Item[]|null>} a Promise that will deliver either an array of all items that are stored in the database or null, in case nothing was found
     */

    async getAllItems(): Promise<Item[] | null> {
        return this.mongo.getItems({}).then(items => {
            items.forEach((item: Item) => {
                printToConsole(item);
            });
            return items;
        }).catch(err => {
            printToConsole(err);
            return null;
        });
    }

    /**
     * Updates an Item.
     * @param {mongoose.Types.ObjectId} id the item's id
     * @param {Item} newItem an item with all new values
     * @return {Promise<Item|null>} a Promise that will deliver either the Item or null, in case the update failed
     */

    async updateItemById(id: mongoose.Types.ObjectId, newItem: Item): Promise<Item | null> {
        return this.mongo.updateItem(id, newItem).then(item => {
            printToConsole("In update item module" + item);
            return item;
        }).catch(err => {
            printToConsole(err);
            return null;
        });
    }

    /**
     * Removes an Item from the database
     * @param {mongoose.Types.ObjectId} id the item's id
     * @return {Promise<Item|null>} a Promise that will deliver either the Item or null, in case removing the Item failed
     */

    async deleteItemById(id: mongoose.Types.ObjectId): Promise<Item | null> {
        return this.mongo.deleteItem(id).then(item => {
            printToConsole(item);
            return item;
        }).catch(err => {
            printToConsole(err);
            return null;
        });
    }

    /**
     * Removes all Item from the database
     */

    async deleteAllItems() {
        await this.mongo.deleteAllItems()
            .then(() => {
                printToConsole("[-] Deleted all items")
            })
            .catch(err => {
                printToConsole(err)
            })
    }

}
