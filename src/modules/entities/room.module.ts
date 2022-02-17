import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Room} from "../../models/room.model";
import {Schema} from "mongoose";
import mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";

/**
 * Module for rooms, providing all roomId functionalities
 *     for roomId controller using methods of mongo module.
 */
export class RoomModule extends EntityModule {
    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * calls addRoom() method of mongo.module, to create a new roomId with name and ipAdress
     * @param {Room} roomData
     * @return {mongoose.Types.ObjectId|null} id for created roomId
     */
    async createRoom(roomData: Room): Promise<mongoose.Types.ObjectId | null> {
        const id = await this.mongo.addRoom(roomData).catch(err => {
            printToConsole(err)
        })
        if (id) {
            printToConsole(`[+] New room with id: ${id} saved.`);
            return id
        }
        return null
    }


    /**
     *  calls getRooms() method of mongo.module, to get all rooms
     *  @return {Room[]} roomId
     */
    async getAllRooms(): Promise<Room[]> {
        const rooms = await this.mongo.getRooms()
        printToConsole(rooms);
        return rooms

    }


    /**
     * calls  findRoom() method of mongo.module, to read properties of a roomId specified by id
     * @param {Schema.Types.ObjectId} id
     */
    async getRoomById(id: mongoose.Types.ObjectId): Promise<Room | null> {
        const room = await this.mongo.findRoom({_id: id}).catch(err => {
            printToConsole(err);
            return null
        })
        if (room) {
            // printToConsole(room)
            return room
        } else {
            return null
        }
    }

    /* //Currently not needed
    async getRoomByName(name: String) {
         this.mongo.findRoom({name: name}).then(roomId => {
         printToConsole(roomId);
         }).catch(err => {
          printToConsole(err);
         })
     }
     */


    /**
     * calls updateRoomById() method of mongo.module, to change properties of an existing roomId
     * @param {mongoose.Types.ObjectId} id
     * @param {Room} newRoom
     * @return {Room|null} updatedRoom
     */
    async updateRoomById(id: mongoose.Types.ObjectId, newRoom: Room): Promise<Room | null> {
        return this.mongo.updateRoomById(id, newRoom)
    }


    /**
     * calls deleteRoomById() method of mongo.module, to delete a roomId specified by id
     * @param {mongoose.Types.ObjectId} id
     * @return {Label|null} deletedRoom
     */
    async deleteRoomById(id: mongoose.Types.ObjectId): Promise<Room | null> {
        return this.mongo.deleteRoomById(id)
    }


    /**
     * calls deleteAllRooms() method of mongo.module, to delete all rooms
     */
    async deleteAllRooms() {
        await this.mongo.deleteAllRooms()
            .then(() => {
                printToConsole("[-] Deleted all rooms")
            })
            .catch(err => {
                printToConsole(err)
            })
    }
}
