import * as mongoose from "mongoose";


/** ITEM
 * Item interface, representing the Position document in MongoDB
 */
export interface Item {
    "_id"?: mongoose.Types.ObjectId,
    "name": Map<string, string>,
    "description": Map<string, string>,
    "countable": boolean,
    "labelIds": mongoose.Types.ObjectId[]
}


/** ITEMCLASS
 * the primary use of this class is to make generating objects satisfying the Item Interface
 * easier by offering an constructor
 */
export class ItemClass implements Item {
    _id?: mongoose.Types.ObjectId;
    name: Map<string, string>;
    description: Map<string, string>;
    countable: boolean;
    labelIds: mongoose.Types.ObjectId[];

    constructor(name: Map<string, string>, description: Map<string, string>, countable: boolean, labels: mongoose.Types.ObjectId[], _id?: mongoose.Types.ObjectId) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.countable = countable;
        this.labelIds = labels;
    }

}