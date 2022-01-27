import {Request, Response} from "express";
import {CrudController} from './crud.controller';
import {Label, LabelClass} from '../models/label.model';
import {LabelModule} from "../modules/entities/label.module";
import {MongoModule} from "../modules/mongo/mongo.module";
import {fromJson} from "../modules/util/util.module";
import {isValidLanguageMap} from "../models/language.model";
import {printToConsole} from"../modules/util/util.module";
import mongoose from "mongoose";

/**
 * Controller for all labelIds, providing all functionalities e.g. (create, read, update, delete)
 *     for the label router using methods of label module.
 */
export class LabelController extends CrudController {
    labelModule: LabelModule;


    constructor(mongo: MongoModule) {
        super();
        this.labelModule = new LabelModule(mongo);
    }

    /**
     * calls createLabel() method of label.module, to create a new label with name and colour
     * @param req
     * @param res
     */
    public create(req: Request, res: Response): void {
        let label: Label;
        let name: Map<string, string> | null = fromJson(req.body.name)
        if (name) {
            if (req.body.colour) {
                label = new LabelClass(name, req.body.colour)
            } else {
                label = new LabelClass(name)
            }
            if (!isValidLanguageMap(name)) {
                res.status(400).send("Bad Request (invalid name)")
            }
                // checks for invalid HEX-Colour using negated:
                // ^          -> match beginning
                // #          -> a hash
                // [0-9A-F]   -> any integer from 0 to 9 and any letter from A to F
                // {6}        -> the previous group appears exactly 6 times
                // $          -> match end
            // i          -> ignore case
            else if (req.body.colour && (!/^#[0-9A-F]{6}$/i.test(req.body.colour))) {
                res.status(400).send("Bad Request (invalid colour)")
            } else {
                this.labelModule.createLabel(label).then((labelId: mongoose.Types.ObjectId | null) => {
                    if (labelId) {
                        printToConsole("Return in controller")
                        res.status(201).send(labelId);
                    } else {
                        res.status(500).send("Internal Server Error");
                    }
                }).catch((err) => {
                    if (err.code === 11000) {
                        res.status(403).send("duplikate")
                    }
                    res.status(500).send("Internal Server Error")
                });
            }
        } else {
            res.status(400).send("no name")
        }

    }

    /**
     * calls getAllLabels() of label.module, to get all labelIds
     * @param req
     * @param res
     */
    public getAll(req: Request, res: Response) {
        this.labelModule.getAllLabels().then(result => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(500).send("Internal Server Error (seems like the objects don't exist)")
            }
        }).catch(() => res.status(500).send("Internal Server Error"));
    }


    /**
     * calls findLabelbyName() method of label.module, to find all label properties by labelname
     * @param req
     * @param res
     */
    public findLabelByName(req: Request, res: Response): void {
        let name: string = req.params.name;
        this.labelModule.findLabelbyName(name).then(result => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(500).send("Internal Server Error (the searched for object might not exist")
            }
        }).catch(() => res.status(500).send("Internal Server Error"));
    }

    public getLabelIdsByItemId(req: Request, res: Response): void {
        this.labelModule.getLabelIdsByItemId(new mongoose.Types.ObjectId(req.params.id)).then((ids) => {
            if (ids) {
                res.status(200).send(ids)
            } else {
                res.sendStatus(500)
            }
        }).catch(() => {
            res.sendStatus(500)
        })
    }

    /**
     * calls getLabelsByItemId() method of label.module, to get all labels describing an item specified by id
     * @param req
     * @param res
     */
    public getLabelsByItemId(req: Request, res: Response): void {
        this.labelModule.getLabelsByItemId(new mongoose.Types.ObjectId(req.params.id)).then((result) => {
            if (result) {
                res.status(200).send(result)
            } else {
                res.status(500).send("Internal Server Error (seems like the objects don't exist)")
            }
        })

    }

    /**
     * calls  findLabelById() method of label.module, to read properties of a label specified by id
     * @param req
     * @param res
     */
    public read(req: Request, res: Response): void {
        let id: string = req.params.id;
        this.labelModule.findLabelById(new mongoose.Types.ObjectId(id)).then(result => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(500).send("Internal Server Error (seems like the object doesn't exist)")
            }
        }).catch(() => res.status(500).send("Internal Server Error"));
    }


    /**
     * calls updateLabel() method of label.module, to change properties of an existing label
     * @param req
     * @param res
     */
    public update(req: Request, res: Response): void {
        let name: Map<string, string> | null = fromJson(req.body.name)
        let id: string = req.params.id;
        let colour: string = req.body.colour;
        if (req.body.colour && (!/^#[0-9A-F]{6}$/i.test(req.body.colour))) {
            res.status(400).send("Bad Request (invalid colour)")
        }
        if (!(name && isValidLanguageMap(name))) {
            res.status(400).send("Bad Request (no Name)")
        } else {
            this.labelModule.updateLabel(new mongoose.Types.ObjectId(id), name, colour).then(result => {
                if (result) {
                    res.status(200).send(result);
                }
            }).catch((err) => {
                if (err.code === 11000) { // duplikate error
                    res.status(403).send("duplikate")
                }
                printToConsole(err)
                res.status(500).send("Internal Server Error")
            });
        }
    }

    /**
     * calls deleteLabel() method of label.module, to delete a label specified by id
     * @param req
     * @param res
     */
    public delete(req: Request, res: Response): void {
        let id: string = req.params.id;
        this.labelModule.deleteLabel(new mongoose.Types.ObjectId(id)).then(result => {
            if (result) {
                res.status(200).send(result); //deleted Entity
            } else {
                res.status(500).send("Internal Server Error")
            }
        }).catch(() => res.status(500).send("Internal Server Error"));
    }


}
