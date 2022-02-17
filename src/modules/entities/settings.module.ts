import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Language} from "../../models/language.model";
import {Schema} from "mongoose";
import mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";
import { Settings } from "../../models/settings.model";


/**
 * Module for settomgs, providing colors and language attributes
 *     for settings controller using methods of mongo module.
 */

export class SettingsModule extends EntityModule {
    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * Creates a new language
     * @param {Language} languageData a Language that holds all needed attributes
     * @return {Promise<mongoose.Types.ObjectId| null>} a Promise that will deliver either the language's id or null, in case the creation failed
     */

    async createSettings(settingsData: Settings): Promise<Boolean | null> {
        const settingsId: Boolean | null = await this.mongo.addSettings(settingsData);
        printToConsole('[+] New settings with id ' + settingsId + ' saved.');
        if (settingsId) {
            return settingsId;
        } else {
            return null;
        }
    }

    /**
     * Gets all languages
     * @return {Promise<Language[]|null>} a Promise that will deliver either an array of all languages that are stored in the database or null, in case nothing was found
     */

    async getAllSettings(): Promise<Settings | null> {
        return this.mongo.getSettings();
    }

    /**
     * Updates Settings
     * @param {[string]} colors new Colors
     * @param {mongoose.Types.ObjectId} language a language with all new values
     * @return {Promise<Settings|null>} a Promise that will deliver either the Settings or null, in case the update failed
     */

    async updateSettings(settings: Settings): Promise<Settings | null> {
        return this.mongo.updateSettings(settings).then(language => {
            return language;
        }).catch(err => {
            printToConsole(err);
            return null;
        })
    }
}
