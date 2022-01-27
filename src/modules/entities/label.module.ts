import {EntityModule} from "./entity.module";
import {MongoModule} from "../mongo/mongo.module";
import {Label, LabelClass} from "../../models/label.model";
import mongoose from "mongoose";
import {printToConsole} from "../../modules/util/util.module";

/**
 * Module for labelIds, providing all label functionalities
 *     for label controller using methods of mongo module.
 */
export class LabelModule extends EntityModule {
    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * calls addLabel() method of mongo.module, to create a new label with name and colour
     * @param {Label} labelData
     * @return {mongoose.Types.ObjectId|null} id for created label
     */
    async createLabel(labelData: Label): Promise<mongoose.Types.ObjectId | null> {
        let labelId;
        if (labelData && labelData.name && labelData.colour) {
            labelId = await this.mongo.addLabel(new LabelClass(labelData.name, labelData.colour));
        } else if (labelData && labelData.name) {
            labelId = await this.mongo.addLabel(new LabelClass(labelData.name))
        }
        if (labelId) {
            printToConsole('[+] New label with id ' + labelId.toString() + ' saved.');
            return labelId
        } else {
            return null
        }
    }

    /**
     * calls findLabel() method of mongo.module, to find a label with specific id
     * @param {mongoose.Types.ObjectId} id
     * @return {Label|null} label
     */
    async findLabelById(id: mongoose.Types.ObjectId): Promise<Label | null> {
        return this.mongo.findLabel({_id: id});
    }

    /**
     * calls findLabel() method of mongo.module, to find all label properties by labelname
     * @param {String} name
     * @return {Label|null} label
     */
    async findLabelbyName(name: string): Promise<Label | null> {
        return this.mongo.findLabel({name: name});
    }

    /**
     * finds all labelIds corresponding to a given item
     * @param {mongoose.Types.ObjectId} id
     * @return {mongoose.Types.ObjectId[]} labelIds
     */
    async getLabelIdsByItemId(id: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> {
        const labelIds = await this.mongo.getItemLabelIds(id)
        printToConsole(labelIds)
        return labelIds;
    }


    /**
     * calls getItemLabels() method of mongo.module, to get all labelIds describing an item specified by id
     * @param {mongoose.Types.ObjectId} id
     * @return {mongoose.Types.ObjectId[]} labelIds
     */
    async getLabelsByItemId(id: mongoose.Types.ObjectId): Promise<Label[]> {
        const labels = await this.mongo.getItemLabels(id)
        printToConsole(labels)
        return labels;
    }


    /**
     *  calls getAllLabels() method of mongo.module, to get all labelIds
     *  @return {Label[]} labelIds
     */
    async getAllLabels(): Promise<Label[]> {
        return this.mongo.getAllLabels()
    }


    /**
     * calls updatelabel() method of mongo.module, to change properties of an existing label
     * @param {mongoose.Types.ObjectId} id
     * @param {String} newName
     * @param {String} newColour
     * @return {Label|null} updatedLabel
     */
    async updateLabel(id: mongoose.Types.ObjectId, newName: Map<string, string>, newColour: string): Promise<Label | null> {
        return this.mongo.updateLabel(id, newName, newColour);
    }


    /**
     * calls deleteLabel() method of mongo.module, to delete a label specified by id
     * @param {mongoose.Types.ObjectId} id
     * @return {Label|null} deletedLabel
     */
    async deleteLabel(id: mongoose.Types.ObjectId): Promise<Label | null> {
        return this.mongo.deleteLabel(id);
    }


    /**
     * calls deleteAllLabels() method of mongo.module, to delete all labelIds
     */
    async deleteAllLabels() {
        await this.mongo.deleteAllLabels()
            .then(() => {
                printToConsole("[-] Deleted all labelIds")
            })
            .catch(err => {
                printToConsole(err)
            })
    }

}
