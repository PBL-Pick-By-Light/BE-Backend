import {Request, Response} from "express";
import {CrudController} from './crud.controller';
import {MongoModule} from "../modules/mongo/mongo.module";
import {RoomModule} from "../modules/entities/room.module";
import {Room, RoomClass} from "../models/room.model";
import {isValidLanguageMap} from "../models/language.model";
import {printToConsole, fromJson} from"../modules/util/util.module";
import mongoose from "mongoose";

/**
 * Controller for all rooms, providing all functionality e.g. (create, read, update, delete)
 *     for the roomId router using methods of roomId module.
 *
 */
export class RoomController extends CrudController {
    roomModule: RoomModule;

    constructor(mongo: MongoModule) {
        super();
        this.roomModule = new RoomModule(mongo)
    }


    /**
     * calls createRoom() method of roomId.module, to create a new roomId with name and ipAddress
     * @param req
     * @param res
     */
    public create(req: Request, res: Response): void {
        const name = fromJson(req.body.name)
        if (!(isValidLanguageMap(name) && req.body.ipAddress && /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(req.body.ipAddress))) {
            printToConsole("Room incomplete (missing name or invalid ipAddress)")
            res.sendStatus(400)
            return
        }
        if (name) {
            this.roomModule.createRoom(new RoomClass(req.body.ipAddress, name)).then((id: mongoose.Types.ObjectId | null) => {
                if (!id) {
                    res.sendStatus(500)
                } else {
                    res.status(201).send(id);
                }
                return
            }).catch((err) => {
                if (err === 11000) { // duplikate error
                    res.status(400).send("duplikate")
                } else {
                    printToConsole(err);
                    res.sendStatus(500);
                }
                return
            });
        }
    }


    /**
     * calls getAllRooms() of roomId.module, to get all rooms
     * @param req
     * @param res
     */
    public getAll(req: Request, res: Response): void {
        this.roomModule.getAllRooms().then((result: Room[]) => {
            res.status(200).contentType('json').send(result);
        }).catch((err) => {
            printToConsole(err);
            res.sendStatus(500);
        })
    }


    /**
     * calls  getRoomById() method of roomId.module, to read properties of a roomId specified by id
     * @param req
     * @param res
     */
    public read(req: Request, res: Response): void {
        this.roomModule.getRoomById(new mongoose.Types.ObjectId(req.params.id)).then((result: Room | null) => {
            res.status(200).contentType('json').send(result);
        }).catch((err) => {
            printToConsole(err)
            res.sendStatus(500)
        })
    }


    /**
     * calls updateRoomById() method of roomId.module, to change properties of an existing roomId
     * @param req
     * @param res
     */
    public update(req: Request, res: Response): void {
        const id   = req.params.id;
        let name = fromJson(req.body.name)
        if (!(isValidLanguageMap(name) && req.body.ipAddress && /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(req.body.ipAddress))) {
            printToConsole("Room incomplete (missing name or ipAddress)")
            res.sendStatus(400)
        }
        if (name) {
            this.roomModule.updateRoomById(new mongoose.Types.ObjectId(id), new RoomClass(req.body.ipAddress, name)).then((result: Room | null) => {
                if (result) {
                    res.status(200).contentType('json').send(result);
                    printToConsole(result);
                } else {
                    res.sendStatus(500)
                }

            }).catch((err: any) => {
                printToConsole(err);
                if (err.code === 11000) {
                    res.status(403).send("duplicate")
                } else {
                    res.sendStatus(500);
                }
            })

        }
    }


    /**
     * calls deleteRoomById() method of roomId.module, to delete a roomId specified by id
     * @param req
     * @param res
     */
    public delete(req: Request, res: Response): void {
        const id = req.params.id;
        this.roomModule.deleteRoomById(new mongoose.Types.ObjectId(id)).then((result: Room | null) => {
            res.status(200).contentType('json').send(result);
        }).catch((err) => {
            printToConsole(err);
            res.sendStatus(500)
        })
    }
}
