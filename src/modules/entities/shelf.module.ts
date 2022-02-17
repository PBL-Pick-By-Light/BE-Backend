import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Shelf} from "../../models/shelf.model";
import mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";

export class ShelfModule extends EntityModule {

    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * tells mongo.module to create a new Shelf doc in the DB using the given values
     * pushes new id to Entities IDsArray and logs action on console
     * @param shelfData : Shelf (see also: shelf.model.ts)
     * values for the new Shelf
     */
    async createShelf(shelfData: Shelf): Promise<mongoose.Types.ObjectId | null> {
        const shelf = await this.mongo.findShelf({number: shelfData.number, roomId: shelfData.roomId})
            .catch((err) => {
                printToConsole(err)
                return null
            })
        if (shelf) {
            printToConsole("No shelf created")
            return null
        } else {
            const id = await this.mongo.addShelf(shelfData)
            printToConsole(`[+] New shelf with id: ${id} saved.`);
            return id;
        }
    }

    // Get functions

    /**
     * tells mongo.module to get all Shelf documents from the DB
     */
    async getAllShelves(): Promise<Shelf[]> {
        const shelves = await this.mongo.getShelves()
        printToConsole(shelves);
        return shelves;
    }

    /**
     * tells mongo.module to get the Shelf document with the given id
     * @param id : mongoose.Types.ObjectId
     */
    async getShelfById(id: mongoose.Types.ObjectId): Promise<Shelf | null> {
        const shelf = await this.mongo.findShelf({_id: id}).catch((err: any) => {
            printToConsole(err);
            return null
        })
        if (shelf) {
            return shelf
        } else {
            return null
        }
    }

    /**
     * tells mongo.module to update the Shelf document with the given id in the DB by using the updatedData
     * @param id : mongoose.Types.ObjectId
     * @param updatedData : Shelf
     */
    async updateShelfById(id: mongoose.Types.ObjectId, updatedData: Shelf): Promise<Shelf | null> {
        return this.mongo.updateShelfById(id, updatedData);
    }

    /**
     * tells mongo.module to delete the Shelf document with the given id in the DB
     * @param id
     * @returns Shelf|null the last representation of the deleted documtent
     */
    async deleteShelfById(id: mongoose.Types.ObjectId): Promise<Shelf | null> {
        return this.mongo.deleteShelfById(id);
    }

    /**
     * tells mongo.module to delete all Shelf documents but dont drop the collection
     */
    async deleteAllShelves() {
        await this.mongo.deleteAllShelves()
            .then(() => {
                printToConsole("[-] Deleted all shelves")
            })
            .catch(err => {
                printToConsole(err)
            })
    }
}
