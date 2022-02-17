import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Position} from "../../models/position.model";
import mongoose from "mongoose";
import {printToConsole} from "../util/util.module";

export class PositionModule extends EntityModule {
    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * Tells the mongo.module to create a position doc in the DB using the given data
     * adds the id to the IDsArray of EntityModule
     * @param positionData : Position
     * @returns positionId : mongoose.Types.ObjectId
     * if doc successful created
     */
    async createPosition(positionData: Position): Promise<mongoose.Types.ObjectId | null> {
        const positionId = await this.mongo.addPosition(positionData)
        if (positionId) {
            printToConsole(`[+] New position with id ${positionId} saved`);
            return positionId;
        }
        return null;
    }


    /**
     * Tells the mongo.module to find the position doc with the given id in the DB and return it
     * @param id : mongoose.Types.ObjectId
     */
    async findPositionbyId(id: mongoose.Types.ObjectId): Promise<Position | null> {
        const position = await this.mongo.findPosition({_id: id})
        printToConsole(position)
        return position
    }

    /**
     * Tells the mongo.module to get an array containing all the Position docs in the DB
     */
    async getAllPositions(): Promise<Position[]> {
        const positions: Position[] = await this.mongo.getPositions({})
        printToConsole(positions)
        return positions
    }

    /**
     * Tells the mongo.module to delete the Position doc with the given id from the DB
     * @param id : mongoose.Types.ObjectId
     */
    async deletePositionById(id: mongoose.Types.ObjectId): Promise<Position | null> {
        const pos = await this.mongo.deletePositionById(id)
        printToConsole(`[-] Deleted Position with id ${pos?._id}`)
        return pos;

    }

    /**
     * Tells the mongo.module to delete all Position docs but dont drop the collection
     */
    async deleteAllPositions() {
        await this.mongo.deleteAllPositions()
            .then(() => {
                printToConsole("[-] Deleted all positions")
            })
            .catch(err => {
                printToConsole(err)
            })
    }

    /**
     * Tells the mongo.module to update the Position doc with the given id
     * @param id
     * Id of the doc to update
     * @param updatedPosition
     * values it shall have after the update
     */
    async updatePositionById(id: mongoose.Types.ObjectId, updatedPosition: Position): Promise<Position | null> {
        const pos = await this.mongo.updatePositionById(id, updatedPosition)
        printToConsole(`Updated Position with id ${id}`)
        return pos;
    }

    /**
     * Tells the mongo.module to update the quantity attribute of the Position doc with the given id
     * @param id
     * Id of the doc to update
     * @param newQuantity
     * value of quantity after the update
     */
    async updatePositionQuantityById(id: mongoose.Types.ObjectId, newQuantity: number): Promise<Position|null>{
        const pos = await this.mongo.updatePositionQuantityById(id, newQuantity);
        printToConsole(`Updated Position with id ${id}`)
        return pos;
    }

    /**
     * Tells the mongo.module to find all the position docs with the item with the given id in the DB
     * returns them as array
     * @param id : mongoose.Types.ObjectId
     */
    async getPositionByItemId(id: mongoose.Types.ObjectId): Promise<Position[]> {
        const pos = await this.mongo.getPositions({itemId: id});
        printToConsole(`Got Positions ${pos} by itemId ${id}`)
        return pos;
    }

}
