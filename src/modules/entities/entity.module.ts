import {MongoModule} from "../mongo/mongo.module";
import mongoose from "mongoose";
import { printToConsole } from '../util/util.module';

/**
 * Parent class for all the entities' modules.
 */
export class EntityModule {

    mongo: MongoModule;

    constructor(mongo: MongoModule) {
        this.mongo = mongo;
    }

}