import { TestData } from "../testdata";
import { MongoModule } from "../../modules/mongo/mongo.module";

export async function addESTestData() {
    const mongo: MongoModule = new MongoModule();
    const testData = new TestData(mongo)
    await testData.addESTestData()
}

addESTestData()
