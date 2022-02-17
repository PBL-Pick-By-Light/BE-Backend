import {ItemModule} from "../modules/entities/item.module";
import {ShelfModule} from "../modules/entities/shelf.module";
import {RoomModule} from "../modules/entities/room.module";
import {MongoModule} from "../modules/mongo/mongo.module";
import {PositionModule} from "../modules/entities/position.module";
import express from "express";
import {Position} from "../models/position.model";
import {Shelf} from "../models/shelf.model";
import {Room} from "../models/room.model";
import {embeddedPORT} from "../config/config.json";
import {shiningId, timer} from "../modules/util/timer";
import { printToConsole } from "../modules/util/util.module";
import mongoose from "mongoose";
import axios from "axios";

/**
 * This Controller controls the light routes.
 * It is an intermediary between Frontend and Embedded Systems.
 * Messages from Frontend need to be brought into a format which Embedded Systems can work with.
 * Also, there can be a need of adding some infos from DB before messaging Embedded Systems.
 *
 * This Controller is NOT a crud-controller. The needed Messages are only turnOn/turnOff
 */

export class LightController {
    itemModule: ItemModule;
    shelfModule: ShelfModule;
    positionModule: PositionModule;
    roomModule: RoomModule;

    constructor(mongo: MongoModule) {
        this.positionModule = new PositionModule(mongo);
        this.itemModule = new ItemModule(mongo);
        this.shelfModule = new ShelfModule(mongo);
        this.roomModule = new RoomModule(mongo);
    }

    /**
     * Takes a request (from Frontend) and sends a Request to turn on the Lights show the positions of a specific item to ES
     * Transforms the Information given by FE (itemId, color, ?duration) into the information needed
     * by Embedded Systems Server to identify and turn on those lights.
     * Therefore, some DB-requests are necessary to find all the positions, shelves and rooms, which are holding the item
     * with the id given by FE.
     * If there is a duration given in the request a countdown will be set and when it reaches 0 a request to ES to turn
     * off the light on the postions holding the item will be send (if it wasn't triggered already by FE).
     * @param {express.Request} req Request from FE, containing itemId, color, duration
     * @param {express.Response} res Response to FE, status ok or error code
     */
    public async turnOn(req: express.Request, res: express.Response) {
        // FE gives ItemId, Color, Duration
        // ES needs PositionNumber, ShelfNumber, Color
        if ((!req.body.itemId) || (!new mongoose.Types.ObjectId(req.body.itemId))) {
            return res.status(400).send("Id missing or in wrong format")
        }
        //////
        printToConsole("id:" + req.body.itemId)
        if (!req.body.color) {
            return res.status(400).send("Color missing")
        }
        //////
        printToConsole("color:" + req.body.color)
        const positions: Position[] = await this.positionModule.getPositionByItemId(new mongoose.Types.ObjectId(req.body.itemId))
        if ((!positions) || positions.length < 1) {
            return res.status(404).send("Found no Position holding this Item")
        }
        //////
        printToConsole("pos:" + positions)
        let atLeastOneSuccess: boolean = false

        let errorResponse: any;
        for (const position of positions) {
            const shelf: null | Shelf = await this.shelfModule.getShelfById(new mongoose.Types.ObjectId(position.shelfId))
            if (!shelf?.roomId) {
                return res.status(400).send("No valid roomId in shelf")
            }
            const room: null | Room = await this.roomModule.getRoomById(new mongoose.Types.ObjectId(shelf?.roomId))
            if (!room) {
                return res.status(400).send("Room was not found in DB")
            }

            let roomIp: undefined | string = room?.ipAddress
            if (shelf && shelf.number && position.number && roomIp) {
                ////
                printToConsole("shelf:" + shelf.number)
                // send to ES
                let response = await axios.post(`http://${roomIp}:${embeddedPORT}/light/turnOn`, {
                    ShelfNumber: shelf.number,
                    PositionId: position.number,
                    Color: req.body.color
                }).catch((err: any)=>{
                    printToConsole("Error:"+ err)
                    errorResponse = err.response;

                })
                if (response && response.status && response.status == 200) {
                    atLeastOneSuccess = true;
                    printToConsole("Status:" + response.status);
                }
            } else {
                return res.status(404).send("Missing room.ipAddress or shelf/shelf.number")
            }
        }
        if (atLeastOneSuccess) {
            shiningId.push(req.body.itemId)
            res.status(200).send("There shall be light")
            if (req.body.duration) {
                timer(() => this.sendTurnOffToES(req.body.itemId), req.body.itemId, req.body.duration)
            }
        } else {
            if(errorResponse.status){
                res.status(500).send("Something went wrong: Status "+errorResponse.status+" Data: "+errorResponse.data)
            }else{
                res.status(500).send("Something went wrong. Is BE connected to the right network?");
            }
        }
    }

    /**
     * Takes a request (from Frontend) and sends a Request to turnOff the Lights show the positions of a specific item
     * to Embedded Systems.
     * Transforms the Information given by FE (itemId, color, ?duration) into the information needed
     * by Embedded Systems Server to identify and turn off those lights.
     * Therefore some DB-requests are necessary to find all the positions, shelves and rooms, which are holding the item
     * with the id given by FE.
     * @param {express.Request} req Request from FE, containing itemId
     * @param {express.Response} res Response to FE, status ok or error code
     */
    public async turnOff(req: express.Request, res: express.Response) {
        if (!((req.body.itemId) || (new mongoose.Types.ObjectId(req.body.itemId)))) {
            return res.status(400).send("id missing or wrong format")
        }
        await this.sendTurnOffToES(req.body.itemId, res)
    }

    /**
     * Takes itemId and sends a Request to turn off the Lights show the positions of the fitting item
     * to Embedded Systems.
     * Transforms the Information (itemId) into the information needed by Embedded Systems Server to identify and turn
     * off those lights.
     * Therefore, some DB-requests are necessary to find all the positions, shelves and rooms, which are holding the
     * id's item.
     * If an express-Response is included in the params, it will finally be sent to indicate success or failure.
     * @param {number} itemId Request from FE, containing itemId
     * @param {express.Response} res? Response to FE, status ok or error code
     */
    public async sendTurnOffToES(itemId: string, res?: express.Response) {
// Necessary for message to ES: shelfNumber and PositionId (they meant PositionNumber. They got confused. It IS the position.number.)

// Get Positions by ItemId (from req.param.id)
        const positions: Position[] = await this.positionModule.getPositionByItemId(new mongoose.Types.ObjectId(itemId))
// Check for success (at least one Position returned)
        if (res) {
            if ((!positions) || positions === [] || positions.length < 1) {
                return res.status(404).send("Could find no Position for Item")
            }
        }
        let atLeastOneSuccess: boolean = false;
        let errorResponse: any;
        for (const position of positions) {
            const shelf: null | Shelf = await this.shelfModule.getShelfById(new mongoose.Types.ObjectId(position.shelfId))
            if (res) {
                if (!shelf?.roomId) {
                    return res.status(400).send("No valid roomId in shelf")
                }
            }
            const room: null | Room = await this.roomModule.getRoomById(new mongoose.Types.ObjectId(shelf?.roomId))
            if (res) {
                if (!room) {
                    return res.status(400).send("Room was not found in DB")
                }
            }
            let roomIp: undefined | string = room?.ipAddress
            if (shelf && shelf.number && position.number && roomIp) {
                // send to ES
                // light/turnOff
                let response = await axios.post(`http://${roomIp}:${embeddedPORT}/light/turnOff`, {
                    ShelfNumber: shelf.number,
                    PositionId: position.number
                }).catch((err: any) => {
                    printToConsole("Error:" + err)
                    errorResponse = err.response;

                })
                if (response && response.status && response.status == 200) {
                    atLeastOneSuccess = true;
                    printToConsole("Status:" + response.status);
                }
            } else {
                if (res) {
                    return res.status(404).send("Missing room.ipAddress or shelf/shelf.number")
                }
            }
        }
            if (atLeastOneSuccess) {
                shiningId.splice(shiningId.indexOf(itemId), 1)
                if (res) {
                    return res.status(200).send("Darkness shall rule!")
                }
            } else {
                if(res) {
                    if(errorResponse) {
                        return res.status(errorResponse.status).send(errorResponse.data)
                    }else{
                        return res.status(500).send()
                    }
                }
            }
    }
}
