import {MongoModule} from "../mongo/mongo.module";
import * as mongoose from "mongoose";
import { printToConsole } from '../util/util.module';

/**
 * Parent class for all the entities' modules.
 */
export class EntityModule {

    mongo: MongoModule;
    IDsArray: mongoose.Types.ObjectId[];

    constructor(mongo: MongoModule) {
        this.mongo = mongo;
        this.IDsArray = [];
    }

    printOutIDsArray(): void {
        printToConsole(this.IDsArray);
    }

}