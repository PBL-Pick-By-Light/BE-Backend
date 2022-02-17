import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Language} from "../../models/language.model";
import {Schema} from "mongoose";
import mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";


/**
 * Module for languages, providing all language functionality
 *     for language controller using methods of mongo module.
 */

export class LanguageModule extends EntityModule {
    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * Creates a new language
     * @param {Language} languageData a Language that holds all needed attributes
     * @return {Promise<mongoose.Types.ObjectId| null>} a Promise that will deliver either the language's id or null, in case the creation failed
     */

    async createLanguage(languageData: Language): Promise<mongoose.Types.ObjectId | null> {
        const languageId: mongoose.Types.ObjectId | null = await this.mongo.addLanguage(languageData);
        if (languageId) {
            return languageId;
        } else {
            return null;
        }
    }

    /**
     * Gets a Language by its id
     * @param {Schema.Types.ObjectId} id id of the Language that is to be found
     * @returns {Promise<Language|null>} a Promise that will deliver either the Language or null, in case it couldn't be found in the database
     */

    async getLanguageById(id: mongoose.Types.ObjectId): Promise<Language | null> {
        return this.mongo.findLanguage({_id: id}).then((language => {
            return language;
        })).catch((err: any) => {
            printToConsole(err);
            return null;
        })
    }

    /**
     * Gets a Language by its name
     * @param {String} name name of the Language that is to be found
     * @return {Promise<Language|null>} a Promise that will deliver either the Language or null, in case it couldn't be found in the database
     */

    async getLanguageByName(name: string): Promise<Language | null> {
        return this.mongo.findLanguage({lang: name}).then((language => {
            return language;
        })).catch((err: any) => {
            printToConsole(err);
            return null;
        })
    }

    /**
     * Gets all languages
     * @return {Promise<Language[]|null>} a Promise that will deliver either an array of all languages that are stored in the database or null, in case nothing was found
     */

    async getAllLanguages(): Promise<Language[]> {
        return this.mongo.getLanguages();
    }

    /**
     * Gets all languages that are required within the application
     * @return {Promise<Language[]|null>} a Promise that will deliver either an array of all required languages that are stored in the database or null, in case nothing was found
     */

    async getRequired(): Promise<Language[]> {
        return this.mongo.getRequired();
    }

    /**
     * Updates a Language.
     * @param {mongoose.Types.ObjectId} id the language's id
     * @param {Language} newLanguage a language with all new values
     * @return {Promise<Language|null>} a Promise that will deliver either the Language or null, in case the update failed
     */

    async updateLanguageById(id: mongoose.Types.ObjectId, newLanguage: Language): Promise<Language | null> {
        return this.mongo.updateLanguage(id, newLanguage).then(language => {
            return language;
        }).catch(err => {
            printToConsole(err);
            return null;
        })
    }

    /**
     * Removes an Language from the database
     * @param {mongoose.Types.ObjectId} id the language's id
     * @return {Promise<Language|null>} a Promise that will deliver either the Language or null, in case removing the Language failed
     */

    async deleteLanguageById(id: mongoose.Types.ObjectId): Promise<Language | null> {
        return this.mongo.deleteLanguage(id).then(language => {
            return language;
        }).catch(err => {
            printToConsole(err);
            return null;
        })
    }
}
