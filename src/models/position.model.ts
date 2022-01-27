import mongoose from "mongoose";
import {Item} from "./item.model";
import {Shelf} from "./shelf.model";

/** POSITION
 * Position interface, representing the Position document in MongoDB
 */
export interface Position {
    itemId?: mongoose.Types.ObjectId,
    "_id"?: mongoose.Types.ObjectId,
    "number": number,
    "quantity": number,
    "shelfId": mongoose.Types.ObjectId
}

/** POSITIONCLASS
 * the primary use of this class is to make generating objects satisfying the Position Interface
 * easier by offering an constructor
 */
export class PositionClass implements Position{
    itemId?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    number: number;
    quantity: number;
    shelfId: mongoose.Types.ObjectId;

    constructor( number: number, quantity: number, shelf: mongoose.Types.ObjectId , item?: mongoose.Types.ObjectId, _id?: mongoose.Types.ObjectId) {
        this.itemId = item;
        this._id = _id;
        this.number = number;
        this.quantity = quantity;
        this.shelfId = shelf;
    }
}