import {Request, Response} from "express";
import {CrudController} from "./crud.controller";
import {LanguageModule} from "../modules/entities/language.module";
import {MongoModule} from "../modules/mongo/mongo.module";
import {Language, LanguageClass} from "../models/language.model";
import {printToConsole} from"../modules/util/util.module";
import mongoose from "mongoose";

/**
 * Controller for all languages, providing all CRUD functionalities
 *     for the language router using methods of language module.
 */

export class LanguageController extends CrudController {
    languageModule: LanguageModule;

    constructor(mongo: MongoModule) {
        super();
        this.languageModule = new LanguageModule(mongo);
    }

    /**
     * Sends all languages.
     * @param req
     * @param res
     */

    public getAll(req: Request, res: Response): void {
        this.languageModule.getAllLanguages().then((result: any) => {
            res.status(200).contentType('json').send(result);
        }).catch(() => res.sendStatus(500));
    }

    /**
     * Sends all required languages.
     * @param req
     * @param res
     */

    public getRequired(req: Request, res: Response): void {
        this.languageModule.getRequired().then(r => {
            res.status(200).contentType('json').send(r);
        }).catch(() => {
            res.sendStatus(500)
        })
    }

    /**
     * Sends a specific language. Uses the language's id to filter.
     * @param req
     * @param res
     */

    public async read(req: Request, res: Response) {
        const languageId: string = req.params.id;

        this.languageModule.getLanguageById(new mongoose.Types.ObjectId(languageId)).then((result: any) => {
            if (result != null) {
                res.status(200).contentType('json').send(result);
            } else {
                res.sendStatus(400);
            }
        }).catch(() => res.sendStatus(500));
    }

    /**
     * Sends a specific language. Uses the language's name to filter.
     * @param req
     * @param res
     */

    public findByName(req: Request, res: Response): void {
        const languageName: string = req.params.lang;
        this.languageModule.getLanguageByName(languageName).then((result: any) => {
            if (result != null) {
                res.status(200).contentType('json').send(result);
            } else {
                res.sendStatus(400);
            }
        }).catch(() => res.sendStatus(500));
    }

    /**
     * Creates a language.
     * @param req
     * @param res
     */

    public create(req: Request, res: Response): void {
        const languageName: string = req.body.lang;
        const required: boolean = false;

        if (languageName.trim() !== undefined && languageName.trim() !== "") {
            this.languageModule.createLanguage(new LanguageClass(languageName, required)).then((id) => {
                res.status(201).send(id);
                printToConsole(id);
            }).catch(() => {
                res.sendStatus(500);
            })
        } else {
            res.sendStatus(400);
        }
    }

    /**
     * Updates a language.
     * @param req
     * @param res
     */

    public async update(req: Request, res: Response): Promise<void> {
        const languageId: string = req.params.id;
        let lang: string = "";

        if (req.body.lang.trim() !== undefined && req.body.lang.trim() !== "") {
            await this.languageModule.getLanguageById(new mongoose.Types.ObjectId(languageId)).then((result: Language | null) => {
                if (result) {
                    lang = result.lang;
                }
                if (lang !== "en" && lang !== "de") {
                    this.languageModule.updateLanguageById(new mongoose.Types.ObjectId(languageId), req.body).then((result) => {
                        res.status(200).contentType('json').send(result);
                    }).catch(() => {
                        res.sendStatus(500);
                    })
                } else {
                    printToConsole("Forbidden: English or German language must not be updated.");
                    res.sendStatus(403);
                }
            }).catch(() => {
                res.sendStatus(500);
            })
        } else {
            res.sendStatus(400);
        }
    }

    /**
     * Deletes a language.
     * @param req
     * @param res
     */

    public async delete(req: Request, res: Response): Promise<void> {
        const languageId: string = req.params.id;
        let lang: string = "";

        await this.languageModule.getLanguageById(new mongoose.Types.ObjectId(languageId)).then((result: Language | null) => {
            if (result) {
                lang = result.lang;
            }
        }).catch(() => {
            res.sendStatus(500);
        })

        if (lang !== "en" && lang !== "de") {
            this.languageModule.deleteLanguageById(new mongoose.Types.ObjectId(languageId)).then((result: any) => {
                if (result != null) {
                    res.status(200).contentType('json').send(result);
                } else {
                    res.sendStatus(400);
                }
            }).catch(() => {
                res.sendStatus(500);
            })
        } else {
            res.sendStatus(403);
        }
    }

}
