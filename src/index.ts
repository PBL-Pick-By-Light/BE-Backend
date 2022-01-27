import express from 'express';
import {Request, Response} from 'express';
import {
    authRouter,
    itemRouter,
    roomRouter,
    shelfRouter,
    labelRouter,
    positionRouter,
    languageRouter,
    lightRouter,
    userRouter,
    settingsRouter
} from './routes'

import config from 'config'
import {Language} from './models/language.model';
import cors from 'cors';
import { printToConsole } from './modules/util/util.module';
import { TestData } from './tests/scripts/testdata';
import { requiredLangs } from './config/constants';
import {MongoModule} from './modules/mongo/mongo.module';
import {PORT} from './config/config.json';

// Database connection
const mongo: MongoModule = new MongoModule();
const testData = new TestData();
testData.addTestDataIfEmpty(false).then(() => {
    mongo.connectToMongo().then(mongoose => {
        console.log(`Connected to MongoDB at ${config.get('Database.mongoURL')}, database: ${mongoose.connection.db.databaseName}\n`)
    }).catch((err:any) => {
        console.log(`Error: Couldn't establish connection to MongoDB at ${config.get('Database.mongoURL')}`)
        console.log(`Is your Docker daemon running?`)
        console.log(`=> sudo systemctl start docker`)
        console.log(`Is your database running?`)
        console.log(`=> docker start mongodb`)
        printToConsole(err)
        process.exit()
    })
})

mongo.getRequired().then((result: Language[]) => {
    for (const language of result) {
        requiredLangs.push(language.lang);
    }
     console.log(`Required languages are: ${requiredLangs}\n`)
})

// Express server
export const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({
    extended: true
}));

app.use("/auth", authRouter)
app.use("/items", itemRouter)
app.use("/rooms", roomRouter)
app.use("/shelves", shelfRouter)
app.use("/labels", labelRouter)
app.use("/positions", positionRouter)
app.use("/languages", languageRouter)
app.use("/light", lightRouter)
app.use("/users", userRouter)
app.use("/settings", settingsRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('This is the pbl-backend project!');
});

app.listen(PORT, () => {
     console.log(`server is listening on ${PORT}`);
})
