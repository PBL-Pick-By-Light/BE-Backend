import {Request, Response} from "express";
import {SettingsModule} from "../modules/entities/settings.module";
import mongoose from "mongoose";
import {printToConsole} from"../modules/util/util.module";
import { MongoModule } from "../modules/mongo/mongo.module";
import { Settings, SettingsClass } from '../models/settings.model';
import { LanguageModule } from '../modules/entities/language.module';

/**
 * Controller for all items, providing all CRUD functionalities
 *     for the item router using methods of item module.
 */

export class SettingsController {
    settingsModule: SettingsModule;
    languageModule: LanguageModule;

    constructor(mongo: MongoModule) {
        this.settingsModule = new SettingsModule(mongo);
        this.languageModule = new LanguageModule(mongo);
    }

    /**
     * Sends all items.
     * @param req
     * @param res
     */

    public getAll(req: Request, res: Response): void {
        this.read(req, res);
    }

    /**
     * Sends a specific item. Uses the item's id to filter.
     * @param req
     * @param res
     */

    public read(req: Request, res: Response): void {
        this.settingsModule.getAllSettings().then((result: Settings | null) => {
            if (result != null) {
                this.languageModule.getLanguageById(result.language).then((language => {
                    let resultJson = {
                        "_id" : result._id,
                        "colors" : result.colors,
                        "language": language?.lang
                    }
                    res.status(200).contentType('json').send(resultJson);
                }))
            }
        }).catch(() => res.sendStatus(500));
    }

    /**
     * Creates settings
     * @param req
     * @param res
     */

    public createOrUpdate(req: Request, res: Response): void {
        const colors: Array<string> = req.body.colors;
        const language: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.body.language);

        this.settingsModule.createSettings(new SettingsClass(colors, language)).then((created) => {
                res.status(201).send(created);
            }).catch((err) => {
                printToConsole(err);
                res.sendStatus(500);
            });
    }

}
