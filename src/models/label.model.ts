import mongoose from "mongoose";


/** LABEL
 * Label interface, representing the Position document in MongoDB
 */
export interface Label {
    _id?: mongoose.Types.ObjectId
    name: Map<string, string>
    colour?: string
}

/** LABELCLASS
 * the primary use of this class is to make generating objects satisfying the Label Interface
 * easier by offering an constructor
 */
export class LabelClass implements Label{
    _id?: mongoose.Types.ObjectId
    name: Map<string, string>
    colour?: string

    constructor(name: Map<string, string>,  colour?: string, _id?: mongoose.Types.ObjectId) {
        this._id = _id;
        this.name = name;
        this.colour = colour
    }
}