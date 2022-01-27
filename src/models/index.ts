import {Item} from "./item.model";
import {Position} from "./position.model";
import {Shelf} from "./shelf.model";
import {User} from "./user.model";
import {Label} from "./label.model";
import {Room} from "./room.model";
import mongoose from "mongoose";
import * as schemes from "../modules/mongo/mongo.schemes";
import {Language} from "./language.model";
import { Settings } from "./settings.model";

// create a ItemModule with specific itemSchema
export const itemModel = mongoose.model<Item>('Item', schemes.itemSchema)

// create a labelModel with specific labelSchema
export const labelModel = mongoose.model<Label>('Label', schemes.labelSchema)

// create a positionModel with specific positionSchema
export const positionModel = mongoose.model<Position>('Position', schemes.positionSchema)

// create roomModel with specific roomSchema
export const roomModel = mongoose.model<Room>('Room', schemes.roomSchema)

// create a shelfModel with specific shelfSchema
export const shelfModel = mongoose.model<Shelf>('Shelf', schemes.shelfSchema);

// create a userModel, with specific userSchema
export const userModel = mongoose.model<User>('User', schemes.userSchema);

// create a languageModel, with specific languageSchema
export const languageModel = mongoose.model<Language>('Language', schemes.languageSchema);

// create a settingsModel, with specific settingsSchema
export const settingsModel = mongoose.model<Settings>('Settings', schemes.settingsSchema);