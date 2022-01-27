import mongoose from "mongoose";


/** ROOM
 * Room interface, representing the Position document in MongoDB
 */
export interface Room{
    "_id"? : mongoose.Types.ObjectId,
    "name": Map<string, string>,
    "ipAddress": string
}


/** ROOMCLASS
 * the primary use of this class is to make generating objects satisfying the Item Interface
 * easier by offering an constructor
 */
export class RoomClass implements Room{
    _id?: mongoose.Types.ObjectId;
    ipAddress: string;
    name: Map<string, string>;

    constructor(ipAddress: string, name: Map<string, string>, _id?: mongoose.Types.ObjectId) {
        if(_id) {
            this._id = _id
        }
        this.name = name
        this.ipAddress = ipAddress;
    }

}