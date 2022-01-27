import mongoose from "mongoose";
import {Room} from "./room.model";

/** SHELF
 * Shelf interface, representing the Shelf document in MongoDB
  */
export interface Shelf{
    "_id"?: mongoose.Types.ObjectId,
    number: number,
    roomId: mongoose.Types.ObjectId
}

/** SHELFCLASS
 * the primary use of this class is to make generating objects satisfying the Shelf Interface
 * easier by offering an constructor
 */
export class ShelfClass implements Shelf{
    _id?: mongoose.Types.ObjectId;
    number: number;
    roomId: mongoose.Types.ObjectId;

    constructor( room: mongoose.Types.ObjectId, number: number, _id?: mongoose.Types.ObjectId) {
        this._id = _id;
        this.number = number;
        this.roomId = room;
    }

}