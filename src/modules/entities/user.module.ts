import mongoose from "mongoose";
import {MongoModule} from "../mongo/mongo.module";
import {User} from "../../models/user.model";
import {EntityModule} from "./entity.module";
import {v4 as uuidv4} from 'uuid';
import {printToConsole} from "../../modules/util/util.module";
import {hashString} from "../auth";

export class UserModule extends EntityModule {

    constructor(mongo: MongoModule) {
        super(mongo);
    }

    /**
     * calls addUser() from mongo.module to create a new User doc in the DB using the given values
     * pushes new id to Entities IDsArray and logs action on console
     * @param userData : User (see also: user.model.ts)
     * calues for a new User
     * @return userId : mongoose.Types.ObjectId |null if successful der userId is returned otherwise null
     */
    async createUser(user: User): Promise<mongoose.Types.ObjectId | null> {
        const userId: mongoose.Types.ObjectId | null = await this.mongo.addUser(user)
        printToConsole('[+] New user with id ' + userId + 'saved.');
        if (userId) {
            return userId;
        } else {
            return null
        }
    }

    generateRandomUser(): User {
        return {
            name: uuidv4().toString(),
            password: uuidv4().toString(),
            salt: hashString.getSalt(),
            role: (Math.random() < 0.33 ? "admin" : (Math.random() < 0.5 ? "editor" : "user"))
        };
    }

    /*     async createnrandomusers(n: number) {
            for (let i = 0; i < n; i++){
                await this.mongo.adduser(this.generaterandomuser())
                    .then(user => {
                    printToConsole(`[${i+1}] new user with id ${user._id} saved.`);
                        this.idsarray.push(user._id);
                    })
                    .catch(err => {
                      printToConsole(err)
                        })
            }
        } */

    /**
     * tells mongo.module to read all Users from DB
     * @return users : User[]
     */
    async getAllUsers(): Promise<User[]> {
        const users = await this.mongo.getUsers();
        return users;
    }

    /**
     * tells mongo.module to get the Shelf document with the given id
     * @param id : mongoose.Types.ObjectId
     * @return
     */
    getUserById(id: any): Promise<User| null> {
        return this.mongo.findUser({_id: id}).then(user => {
            printToConsole(user);
            return user;
        }).catch(err => {
            printToConsole(err);
            return null
        })
    }

    /**
     * tells mongo.module to get the Shelf document with the given json web token(jwt)
     * @param jwt : string
     * @return user : User
     */
    findUserByJWT(jwt: string): Promise<User | null> {
        return this.mongo.findUser({jwt: jwt})
    }


    /**
     * tells mongo.module to get the Shelf document with the given name from DB
     * @param username : string
     * @return user : User
     */
    getUserByName(username: string): Promise<User | null> {
        return this.mongo.findUser({name: username}).then(user => {
            printToConsole(user);
            return user;
        }).catch(err => {
            printToConsole(err);
            return null;
        });
    }

    /**
     * tells mongo.module to delete jwt from User document with the given id from DB
     * @param id
     */
    async removeJWT(id: mongoose.Types.ObjectId): Promise<User | null> {
        return this.mongo.removeJWT(id);
    }

    /**
     * tells mongo.module to delete the User document with the given id from DB
     * @param id
     */
    async deleteUser(id: mongoose.Types.ObjectId): Promise<User | null> {
        const user: User | null = await this.mongo.deleteUser(id);
        printToConsole("[-] deleted user " + user)
        return user
    }

    /**
     * tells mongo.module to update the User document with the given id with new attributes
     * @param id : mongoose.Types.ObjectId
     * @param updatedUser : user
     */
    async updateUser(id: mongoose.Types.ObjectId, updatedUser: User): Promise<User | null> {
        const user = await this.mongo.updateUser(id, updatedUser)
        return user
    }

    /**
     * tells mongo.module to delete all User doc from DB
     * @return users : User[] | null
     */
    async deleteAllUsers(): Promise<User[] | null> {
        await this.mongo.deleteAllUsers().then(users => {
            return users;
        }).catch(err => {
            printToConsole(err)
            return null;
        })
        return null;
    }

}
