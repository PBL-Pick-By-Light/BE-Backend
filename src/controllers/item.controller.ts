import {Request, Response} from "express";
import {CrudController} from './crud.controller';
import {ItemModule} from "../modules/entities/item.module";
import {PositionModule} from "../modules/entities/position.module";
import {ShelfModule} from "../modules/entities/shelf.module";
import {MongoModule} from "../modules/mongo/mongo.module";
import {Item, ItemClass} from "../models/item.model";
import {isValidLanguageMap} from "../models/language.model";
import {printToConsole, fromJson} from"../modules/util/util.module";
import mongoose from "mongoose";

/**
 * Controller for all items, providing all CRUD functionality
 *     for the item router using methods of item module.
 */

export class ItemController extends CrudController {
    itemModule: ItemModule;
    positionModule: PositionModule;
    shelfModule: ShelfModule;

    constructor(mongo: MongoModule) {
        super();
        this.itemModule = new ItemModule(mongo)
        this.positionModule = new PositionModule(mongo);
        this.shelfModule = new ShelfModule(mongo);
    }

    /**
     * Sends all items.
     * @param req
     * @param res
     */


    public getAll(req: Request, res: Response): void {
        this.itemModule.getAllItems().then((result: any) => {
            res.status(200).contentType('json').send(result);
        }).catch(() => res.sendStatus(500));
    }

    // Sends all countable items.
    // params: Request req, Response res
    // returns: void
    public getAllCountable(req: Request, res: Response): void {
        this.itemModule.getAllCountableItems().then((result: any) => {
            res.status(200).contentType('json').send(result);
        }).catch(() => res.sendStatus(500));
    }

    /**
     * Sends a specific item. Uses the item's id to filter.
     * @param req
     * @param res
     */

    public async read(req: Request, res: Response) {
        const itemID: string = req.params.id;

        let mongooseItemId: any;
        try {
            mongooseItemId = new mongoose.Types.ObjectId(itemID);
        } catch (error) {
            printToConsole("Invalid item ID! Could not convert to mongoose.Types.ObjectId.");
            res.status(400).contentType("application/json").send({status: "Bad request"});
            return
        }

        this.itemModule.getItemById(mongooseItemId).then(async (result: any) => {

            if (!result) {
                printToConsole(`Could not find item ${itemID}!`);
                res.status(404).contentType("application/json").send({status: "Not Found"});
                return
            }
            res.status(200).contentType('json').send(result);
            return

        }).catch(() => res.status(500).contentType("application/json").send({status: "Internal Server=Error"}));
    }


    /**
     * Sends specific items. Uses the items' labels to filter.
     * @param req
     * @param res
     */

    public findByLabel(req: Request, res: Response): void {
        const tagList: mongoose.Types.ObjectId[] = req.body.labelIds;
        printToConsole(tagList)
        if (tagList && tagList.length > 0) {
            this.itemModule.getItemByLabels(tagList).then((result: any) => {
                res.status(200).contentType('json').send(result);
            }).catch(() => res.sendStatus(500));
        } else {
            res.sendStatus(400);
        }
    }

    /**
     * Creates an item.
     * @param req
     * @param res
     */

    public create(req: Request, res: Response): void {
        const name: string = req.body.name;
        const description: string = req.body.description

        const nameMap: Map<string,string> = fromJson(name);
        const descriptionMap: Map<string, string> = fromJson(description);

        const itemCountability: boolean = req.body.countable;
        const itemLabels: mongoose.Types.ObjectId[] = req.body.labelIds;

        if (nameMap && descriptionMap && isValidLanguageMap(nameMap) && isValidLanguageMap(descriptionMap) && itemCountability !== undefined && itemCountability && itemLabels !== undefined) {
            this.itemModule.createItem(new ItemClass(nameMap, descriptionMap, itemCountability, itemLabels)).then((id) => {
                res.status(201).send(id);
            }).catch(() => {
                printToConsole("500er code, item countable")
                res.sendStatus(500);
            });
        } else if (isValidLanguageMap(nameMap) && isValidLanguageMap(descriptionMap) && itemCountability !== undefined && !itemCountability && itemLabels !== undefined) {
            this.itemModule.createItem(new ItemClass(nameMap, descriptionMap, itemCountability, itemLabels)).then((id) => {
                res.status(201).send(id);
            }).catch((err) => {
                printToConsole("500er code, item uncountable")
                printToConsole(err);
                res.sendStatus(500);
            });
        } else {
            res.sendStatus(400);
        }
    }

    /**
     * Updates an item.
     * @param req
     * @param res
     */

    public update(req: Request, res: Response): void {
        const name: string = req.body.name;
        const description: string = req.body.description

        const itemId: string = req.params.id;
        const nameMap: Map<string, string> = fromJson(name);
        const descriptionMap: Map<string, string> = fromJson(description);

        if (nameMap && descriptionMap && isValidLanguageMap(nameMap) && isValidLanguageMap(descriptionMap) && req.body.countable !== undefined && req.body.labelIds !== undefined) {
            printToConsole("Check bestanden")
            this.itemModule.updateItemById(new mongoose.Types.ObjectId(itemId), req.body).then((result: Item | null) => {

                res.status(200).contentType('json').send(result);
            }).catch(() => {
                res.sendStatus(400);
            });
        } else {
            res.sendStatus(400);
        }
    }

    /**
     * Deletes an item.
     * @param req
     * @param res
     */

    public delete(req: Request, res: Response): void {
        const itemId: string = req.params.id;
        this.itemModule.deleteItemById(new mongoose.Types.ObjectId(itemId)).then((result) => {
            if (result != null) {
                res.status(200).contentType('json').send(result);
                 printToConsole('not found')
            } else {
                res.sendStatus(400);
            }
        }).catch((err) => {
            printToConsole(err)
            res.sendStatus(500);
        });
    }
}
