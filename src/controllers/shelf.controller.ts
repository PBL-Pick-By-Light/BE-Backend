import {Request, Response} from "express";
import {CrudController} from './crud.controller';
import {Shelf} from "../models/shelf.model";
import {MongoModule} from "../modules/mongo/mongo.module";
import {ShelfModule} from "../modules/entities/shelf.module";
import {printToConsole} from"../modules/util/util.module";
import mongoose from "mongoose";


/** SHELF CONTROLLER
 * Class for actions triggered on Shelf docs in the DB.
 * The functions are intended to be triggered via Router and therefore accept HTTP- Requests and Responses as parameter.
 */
export class ShelfController extends CrudController {
    shelfModule: ShelfModule;

    constructor(mongo: MongoModule) {
        super();
        this.shelfModule = new ShelfModule(mongo)
    }

    /** CREATE
     * Creates and adds a Shelf document to the DB.
     * @param req : e.Request
     * has to contain in its body an Object that fulfils the requirements of the Shelf Interface (see: shelf.model.ts)
     * @param res : e.Response
     * A HTTP-Response which will be send containing a status code, and,
     * if successful, the id of the newly created Shelf document.
     */

    //todo where is check for duplicate shelve ?
    public create(req: Request, res: Response): void {
        this.shelfModule.createShelf(req.body).then((id: mongoose.Types.ObjectId | null) => {
            if (id == null) {
                res.status(500).send("Shelf already exists")
            } else {
                res.status(201).send(id)
            }
        }).catch((err: Error) => {
            res.status(500).send("InternalServerError");
            printToConsole(`Something went wrong adding a Shelf in crud-action create.\nERROR: ${err}`)
        })
    }

    /** ALL
     * Finds all Shelf documents in the DB and returns them
     * @param req : e.Request
     * needs no further params or body
     * @param res : e.Response
     * Returns a HTTP-Response containing a statuscode and, if successful, an array of all
     * Shelves saved in the DB in its body
     */
    public getAllShelves(req: Request, res: Response): void {
        this.shelfModule.getAllShelves().then((shelves: Shelf[]) => {
            res
                .status(200)
                .send(shelves)
        }).catch((err: Error) => {
            res.status(500).send("InternalServerError");
            printToConsole(`Something went wrong getting all Shelves in crud-action read.\nERROR: ${err}`)
        })
    }

    /** READ
     * Finds and returns a Shelf doc using its id
     * @param req : e.Request
     * HTTP-Request containing the id of the wanted Shelf document in its params (in the URL)
     * @param res : e.Response
     * HTTP-Response containing a status code and if successful, the Shelf in its body
     */
    public read(req: Request, res: Response): void {
        this.shelfModule.getShelfById(new mongoose.Types.ObjectId(req.params.id)).then((shelf: Shelf | null) => {

            if (shelf) {
                res.status(200)
                    .send(shelf)
            } else {
                res.sendStatus(404)
            }

        }).catch((err) => {
            res.status(500).send("InternalServerError");
            printToConsole(err)
        })

    }

    /** UPDATE
     * Finds and updates a Shelf document in the DB using its id.
     * @param req : e.Request
     * HTTP-Request containing the id of the Shelf document to update in the params (in the URL)
     * and an object satisfying the Shelf interface containing the updated values
     * @param res : e.Response
     * HTTP-Response containing a status code and, if successful, the updated Shelf document in its body
     */

    public update(req: Request, res: Response): Shelf | null {
        this.shelfModule.updateShelfById(new mongoose.Types.ObjectId(req.params.id), req.body)
            .then(shelf => {
                if (shelf !== null) {
                    res.status(200).send(shelf)
                } else res.status(404).send("No such shelf.");
                return shelf;
            }).catch((err) => {
                res.status(500).send("InternalServerError");
                printToConsole("Something went wrong in updating a shelf.\n ERROR " + err)
                return null;
            })
        return null;
    }

    /** DELETE
     * Finds and deletes a Shelf document in the DB using its id.
     * @param req : e.Request
     * HTTP-Request containing the document's id in the params (in the URL)
     * @param res : e.Response
     * HTTP-Response containing a status code and, if successful, the deleted Shelf document in its body
     */
    public delete(req: Request, res: Response): void {
        this.shelfModule.deleteShelfById(new mongoose.Types.ObjectId(req.params.id)).then((shelf: Shelf | null) => {
            if (shelf) {
                res.status(200)
                    .send(shelf)
            } else {
                res.status(404).send("No such shelf.");
            }
        }).catch((err) => {
            res.status(500).send("InternalServerError");
            printToConsole("InternalServerError.\n ERROR " + err)
        })
    }
}
