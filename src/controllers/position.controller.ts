import {CrudController} from "./crud.controller";
import {PositionModule} from "../modules/entities/position.module";
import {ItemModule} from "../modules/entities/item.module";
import {ShelfModule} from "../modules/entities/shelf.module";
import {MongoModule} from "../modules/mongo/mongo.module";
import express from "express";
import {Position} from "../models/position.model";
import {Item} from "../models/item.model";
import {printToConsole} from"../modules/util/util.module";
import mongoose from "mongoose";

/** POSITION CONTROLLER
 * Class for actions triggered on Position docs in the DB.
 * The functions are intended to be triggered via Router an therefore accept HTTP- Requests and Responses as parameter.
 */
export class PositionController extends CrudController {
    positionModule: PositionModule;
    itemModule: ItemModule;
    shelfModule: ShelfModule;

    //positionId : string

    constructor(mongo: MongoModule) {
        super();
        this.positionModule = new PositionModule(mongo);
        this.itemModule = new ItemModule(mongo);
        this.shelfModule = new ShelfModule(mongo);
        //this.positionId = "61aa445f324c368e4a594cae"
    }

    /** CREATE
     * Creates and adds a Position document to the DB.
     * @param req :express.Request
     * has to contain in its body an Object that fulfils the requirements of the Position Interface (see: position.model.ts)
     * @param res :express.Response
     * A HTTP-Response which will be send containing a statuscode, and,
     * if successful, the id of the newly created Position document.
     */
    public async create(req:express.Request, res:express.Response): Promise<void> {
        //all attributes have to be defined
        if (typeof req.body.itemId === 'undefined' || typeof req.body.number === 'undefined' || typeof req.body.quantity === 'undefined' || typeof req.body.shelfId === 'undefined') {
            res.status(400).send("not all attributes are given")
            return
        }

        //required properties number and shelf must have a value
        if (!req.body.number || !req.body.shelfId) {
            res.status(400).send("number or shelfId is not given")
            return
        }


        //check quantity only is set, when item is countable
        if (req.body.itemId) {
            let item: Item | null = await this.itemModule.getItemById(new mongoose.Types.ObjectId(req.body.itemId))
            if (item?.countable && !req.body.quantity
                || !item?.countable && req.body.quantity
                || !item && req.body.quantity) {
                res.status(400).send("countable doesn't fit to quantity")
                return
            }
        } else {
            if (req.body.quantity) {
                res.status(400).send("countable doesn't fit to quantity")
                return
            }
        }


        //position already exists?
        let position: Position | null = await this.positionModule.mongo.findPosition({
            shelfId: req.body.shelfId,
            number: req.body.number
        })
        if (position) {
            res.status(403).send("position already exists")
            return
        }


        //create position
        this.positionModule.createPosition(req.body).then((posId: mongoose.Types.ObjectId | null) => {
            if (posId) {
                res.status(201).send(posId)
            } else {
                res.sendStatus(500)
            }
        }).catch((err) => {
            res.status(500).send("Internal Server Error")
        })
    }


    /** DELETE
     * Finds and deletes a Position document using its id.
     * @param req :express.Request
     * has to contain in its params (in the URL) the id of the document to delete
     * @param res :express.Response
     * sends a HTTP-Request containg a status code and if successful, a last representation of the
     * deleted Position document in its body.
     */
    delete(req:express.Request, res:express.Response): void {
        this.positionModule.deletePositionById(new mongoose.Types.ObjectId(req.params.id)
        ).then((position: Position | null) => {
            if (position) {
                res.status(200).send(position)
            } else {
                res.sendStatus(400)
            }
        }).catch(err => {
            res.sendStatus(500)
            printToConsole(err)
        })
    }


    /** ALL
     * Finds all Position documents in the DB and returns them
     * @param req :express.Request
     * needs no further params or body
     * @param res :express.Response
     * Returns a HTTP-Response containing a statuscode and, if successful, an array of all
     * Positions saved in the DB in its body
     */
    all(req:express.Request, res:express.Response): void {
        this.positionModule.getAllPositions().then((positions: Position[]) => {
            res.status(200).send(positions)
        }).catch((err) => {
            res.status(500)
            printToConsole(err)
        })
    }

    /** READ
     * Finds and returns a Position doc using its id
     * @param req :express.Request
     * HTTP-Request containing the id of the wanted Position document in its params (in the URL)
     * @param res :express.Response
     * HTTP-Response containing a status code and if successful, the Position in its body
     */
    read(req:express.Request, res:express.Response): void {
        this.positionModule.findPositionbyId(new mongoose.Types.ObjectId(req.params.id)).then((pos: Position | null) => {
            if (pos) {
                res.status(200).send(pos)
            } else {
                return res.sendStatus(400)
            }
        }).catch((err) => {
            res.sendStatus(500)
            printToConsole(err);
        })
    }

    /** GET POSITION BY ITEM ID
     * Gives all Position doc containing an item doc with the given id
     * @param req
     * @param res
     */
    getPositionsByItemID(req:express.Request, res:express.Response): void {
        this.positionModule.getPositionByItemId(new mongoose.Types.ObjectId(req.params.id)).then((pos: Position[]) => {
            if (pos) {
                res.status(200).send(pos)
            } else {
                return res.sendStatus(400)
            }
        }).catch((err) => {
            res.sendStatus(500)
            printToConsole(err);
        })
    }

    /** UPDATE
     * Finds and updates a Position document in the DB using its id.
     * @param req :express.Request
     * HTTP-Request containing the id of the Position document to update in the params (in the URL)
     * and an object satisfying the Position interface containing the updated values
     * @param res :express.Response
     * HTTP-Response containing a statuscode and, if successful, the updated Position document in its body
     */
    async update(req:express.Request, res:express.Response): Promise<void> {
        //all attributes have to be defined
        if (typeof req.body.itemId === 'undefined' || typeof req.body.number === 'undefined' || typeof req.body.quantity === 'undefined' || typeof req.body.shelfId === 'undefined') {
            res.status(400).send("not all attributes are given")
            return
        }

        //only item and quantity is updateable, number and shelf not updateable
        const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id);
        let position: Position | null = await this.positionModule.findPositionbyId(id)
        if (position) {
            if (req.body.number != position.number || req.body.shelfId != position.shelfId) {
                res.status(400).send("shelf and number are not updateable")
                return
            }
        }

        //check quantity only is set, when item is countable
        if (req.body.itemId) {
            let item: Item | null = await this.itemModule.getItemById(new mongoose.Types.ObjectId(req.body.itemId))
            if (item?.countable && !req.body.quantity
                || !item?.countable && req.body.quantity
                || !item && req.body.quantity) {
                res.status(400).send("countable doesn't fit to quantity")
                return
            }
        } else {
            if (req.body.quantity) {
                res.status(400).send("countable doesn't fit to quantity")
                return
            }
        }

        //update position
        this.positionModule.updatePositionById(id, req.body).then((newPosition: Position | null) => {
            if (newPosition) {
                res.status(200).send(newPosition)
            } else {
                res.sendStatus(400)
            }
        }).catch((err) => {
            res.status(500).send("couldn't be updated")
        })
    }
}
