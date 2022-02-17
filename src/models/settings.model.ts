import mongoose from "mongoose";

/** SETTINGS
 * Settings interface, representing the Settings document in MongoDB
 */
export interface Settings {
    "_id"?: mongoose.Types.ObjectId,
    "colors": Array<string>,
    "language": mongoose.Types.ObjectId
}

/** SETTINGSCLASS
 * the primary use of this class is to make generating objects satisfying the Settings Interface
 * easier by offering an constructor
 */
export class SettingsClass implements Settings {
    _id?: mongoose.Types.ObjectId;
    colors: Array<string>;
    language: mongoose.Types.ObjectId;

    constructor(colors: Array<string>, language: mongoose.Types.ObjectId, _id?: mongoose.Types.ObjectId) {
        this._id = _id;
        this.colors = colors;
        this.language = language;
    }
}
