import mongoose, {Schema} from "mongoose";

import {Item} from "../../models/item.model";
import {Label} from "../../models/label.model";
import {Position} from "../../models/position.model";
import {Room} from "../../models/room.model";
import {Shelf} from "../../models/shelf.model";
import {User} from "../../models/user.model";
import {Language} from "../../models/language.model";
import { Settings } from "../../models/settings.model";

 /**
 * Label
 * create a labelSchema corresponding to the document Label interface
 */
export const labelSchema = new Schema<Label> ({
    name: {type: Map, required: true, sparse: true}, //use sparse to avoid problems with duplicate null keys
    colour: {type:String, required: false, sparse: true}
})

/**
 * Item
 * create an itemSchema corresponding to the document Item interface
 */
export const itemSchema = new Schema<Item>({
    name: { type: Map, required: true},
    description: {type: Map, required: false},
    countable: {type: Boolean, required: true},
    labelIds: {type: [mongoose.Types.ObjectId], required: true}
})

/**
 * Room
 * create a roomSchema corresponding to the document Room interface
 */
export const roomSchema = new Schema<Room>({
    name: { type: Map, required: true},
    ipAddress: { type: String, required: true}
});

/**
 * Shelf
 * create a shelfSchema corresponding to the document Shelf interface
 */
export const shelfSchema = new Schema<Shelf>({
    number: {type: Number, required: true},
    roomId: {type: mongoose.Types.ObjectId, required: true}
});

/**
 * User
 * create a userSchema corresponding to the document User interface
 */
export const userSchema = new Schema<User> ({
    jwt: { type: String, required: false },
    name: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: {type: String, required: false },
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    email: {type: String, required: false},
    searchColor: {type: String, required: false},
    language: {type: String, required: false},
    role: { type: String, required: true}

});

/**
 * Position
 * create a positionSchema corresponding to the document Position interface
 */
export const positionSchema = new Schema<Position>({
    itemId: {type: mongoose.Types.ObjectId, required: false},
    number: {type: Number, required: true},
    quantity: {type: Number, required: false},
    shelfId: {type: mongoose.Types.ObjectId, required: true}
});

/**
 * Language
 * create a languageSchema corresponding to the document Language interface
 */
export const languageSchema = new Schema<Language>({
    lang: {type: String, required: true, unique: true},
    required: {type: Boolean, required: true}
});

// Settings
// create a settingsSchema corresponding to the document Settings interface
// capped attribute max: 1 because there is only one instance of settings

export const settingsSchema = new Schema<Settings>({
    colors: [{type: String, required: false}],
    language: {type: mongoose.Types.ObjectId, required: false}
},
{
    capped: { size: 1024, max: 1 }
}    
);
