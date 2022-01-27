import mongoose from "mongoose";
import {requiredLangs} from "../config/constants";

/** LANGUAGE
 * Language interface, representing the Position document in MongoDB
 */
export interface Language {
    _id?: mongoose.Types.ObjectId;
    lang: string;
    required: boolean;
}

/**
 * checks if given language Map is valid using functions hasRequiredLangs()
 *      and hasValueForKeyCheck()
 * @param {Map<string, string>} toCheck language Map that has to be checked
 * @return boolean true if map is valid, false if map is not valid
 */
export function isValidLanguageMap(toCheck: Map<string, string> | null): boolean {
    return hasRequiredLangs(toCheck) && hasValueForKey(toCheck)
}

/**
 * checks if all required languages are included
 * @param {Map<string, string>} toCheck language Map that has to be checked
 * @return boolean true if map is valid, false if map is not valid
 */
function hasRequiredLangs(toCheck: Map<string, string> | null): boolean {
    if (toCheck) {
        for (const lang of requiredLangs) {
            if (!toCheck.has(lang)) {
                return false;
            } else if (!(typeof toCheck.get(lang) == "string")) {
                return false;
                // @ts-ignore
            } else if (toCheck.get(lang).trim() == "") {
                return false;
            }
        }
        return true;
    }
    return false;

}

/**
 * checks if all given keys correspond to a valid value
 * @param {Map<string, string>} toCheck language Map that has to be checked
 * @return boolean true if map is valid, false if map is not valid
 */
export function hasValueForKey(toCheck: Map<string, string> | null): boolean {
    if (toCheck) {
        for (const key in toCheck) {
            if (!(key && toCheck.has(key) && toCheck.get(key))) {
                return false
            } else { // @ts-ignore
                if (toCheck.get(key).trim() == "") {
                    return false
                }
            }
        }
        return true;
    }
    return false;
}

/**
 * generates a new map with any given English or German word, name or description
 *      and its given translation
 * @param {string} en word, name or description in English
 * @param {string} de word, name or description in German
 * @return Map<string,string> generated English - German map
 */
export function generateEnglishGermanMap(en: string, de: string): Map<string, string> {
    return new Map<string, string>().set("en", en).set("de", de);
}

/**
 * generates a new map with any given content that is provided in JSON
 * @param {any} content given content that has to be mapped
 * @return Map<string,string> map that contains the given content as well as the
 *      language in which the given content is written
 */
export function generateMapFromJSON(content: any): Map<string, string> {
    const map = new Map<string, string>()
    requiredLangs.forEach(lang => {
        map.set(lang, content.la)
    })
    return map;
}

/** LANGUAGECLASS
 * the primary use of this class is to make generating objects satisfying the Language Interface
 * easier by offering an constructor
 */

export class LanguageClass implements Language {
    _id?: mongoose.Types.ObjectId;
    lang: string;
    required: boolean;

    constructor(lang: string, required: boolean) {
        this.lang = lang;
        this.required = required;
    }
}
