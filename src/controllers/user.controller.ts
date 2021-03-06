import {Request, Response} from "express";
import {CrudController} from './crud.controller';
import { User, UserClass} from "../models/user.model";
import {MongoModule} from "../modules/mongo/mongo.module";
import {UserModule} from "../modules/entities/user.module";
import {printToConsole} from "../modules/util/util.module";
import { hashString } from "../modules/auth";
import mongoose from "mongoose";


/** USER CONTROLLER
 * Class for actions triggered on User docs in the DB.
 * The functions are intended to be triggered via Router an therefore accept HTTP- Requests and Responses as parameter.
 */
export class UserController extends CrudController {
    userModule: UserModule;

    constructor(mongo: MongoModule) {
        super();
        this.userModule = new UserModule(mongo)
    }

    /** CREATE
     * Creates and adds an User document to the DB.
     * @param req : e.Request
     * has to contain an Object in its body that fulfils the requirements of the User Interface (see: user.model.ts)
     * @param res : e.Response
     * A HTTP-Response which will be send containing a status code, and,
     * if successful, the id of the newly created User document.
     */
    public create(req: Request, res: Response): void {
        const salt = hashString.getSalt()
        if (!["user","editor","admin"].includes(req.body.role.trim())){
            res.status(400).send("Incorrect role")
            return
        }
        const role = req.body.role
        const userName = req.body.name
        if (!userName || userName == ""){
            res.status(400).send("Username missing")
            return
        }
        const password = req.body.password
        if (!password || password == ""){
            res.status(400).send("Password missing")
            return
        }
        hashString.encode(password.trim(), salt).then((passwordHash) => {
            this.userModule.createUser(
                new UserClass(
                    userName.trim(),
                    passwordHash,
                    "user",
                    salt,
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    req.body.searchColor,
                    req.body.language
                )
            ).then((id: mongoose.Types.ObjectId | null) => {
                if (id) {
                    res.status(201).send(id)
                } else {
                    res.sendStatus(500)
                }
            }).catch((err: Error) => {
                res.sendStatus(500)
                printToConsole(`Something went wrong adding an User in crud-action create.\nERROR: ${err}`)
            })
        })
    }

    /** ALL
     * Finds all User documents in the DB and returns them
     * @param req : e.Request
     * needs no further params or body
     * @param res : e.Response
     * Returns a HTTP-Response containing a statuscode and, if successful, an array of all
     * Users saved in the DB in its body
     */
    public getAllUsers(req: Request, res: Response): void {
        this.userModule.getAllUsers().then((users: User[]) => {
            res.status(200).send(users);
        }).catch((err: Error) => {
            res.sendStatus(500)
            printToConsole(`Something went wrong getting all users in crud-action read.\nERROR: ${err}`)
        })
    }

    /** READ
     * Finds and returns an User doc using its JWT
     * @param req : e.Request
     * HTTP-Request containing the id of the wanted User document in its params (in the URL)
     * @param res : e.Response
     * HTTP-Response containing a status code and if successful, the User in its body
     */
    public read(req: Request, res: Response): void {
        this.userModule.findUserByJWT(req.params.jwt).then((user: User | null) => {
            if (user) {
                res.status(200).send(user)
            } else {
                res.sendStatus(500)
            }
        }).catch((err) => {
            res.sendStatus(500)
            printToConsole(err)
        })
    }

    /** GETBYNAME
     * Finds and returns an User doc using its JWT
     * @param req : e.Request
     * HTTP-Request containing the id of the wanted User document in its params (in the URL)
     * @param res : e.Response
     * HTTP-Response containing a status code and if successful, the User in its body
     */
    public getByName(req: Request, res: Response): void {
        const userName = req.params.name
        if (!userName || userName == ""){
            res.status(400).send("Username missing")
            return
        }
        this.userModule.getUserByName(userName).then((user: User | null) => {
            if (user) {
                res.status(200).send(user)
            } else {
                res.sendStatus(500)
            }
        }).catch((err) => {
            res.sendStatus(500)
            printToConsole(err)
        })
    }

    /** UPDATE
     * Finds and updates a User document in the DB using its id.
     * @param req : e.Request
     * HTTP-Request containing the id of the User document to update in the params (in the URL)
     * and an object satisfying the User interface containing the updated values
     * @param res : e.Response
     * HTTP-Response containing a status code and, if successful, the updated User document in its body
     */
    public update(req: Request, res: Response): void {
        if (req.body.role && !["user","editor","admin"].includes(req.body.role.trim())){
            res.status(400).send("Incorrect role")
            return
        }
        this.userModule.getUserById(req.params.id)
            .then((user: User | null) => {
                if (user === null){
                    res.status(404).send("User not found")
                    return
                }
                const name = req.body.name? req.body.name: user.name
                const role = req.body.role? req.body.role: user.role

                if (req.body.password){
                    const salt = hashString.getSalt()
                    hashString.encode(req.body.password.trim(), salt).then((passwordHash) => {
                        this.updateUser(req, res,
                            new UserClass(
                                name,
                                passwordHash,
                                role,
                                salt,
                                req.body.firstname,
                                req.body.lastname,
                                req.body.email,
                                req.body.searchColor,
                                req.body.language
                            ))
                        return
                    })
                } else {
                    this.updateUser(req, res,
                            new UserClass(
                                name,
                                user.password,
                                role,
                                user.salt,
                                req.body.firstname,
                                req.body.lastname,
                                req.body.email,
                                req.body.searchColor,
                                req.body.language
                            ))
                }

            })
    }

    private updateUser(req: Request, res: Response, user: User){
        this.userModule.updateUser(
            new mongoose.Types.ObjectId(req.params.id), user
        ).then((user: User | null) => {
            if (user) {
                res.status(200).send(user)
            }
        }).catch((err) => {
            res.sendStatus(500)
            printToConsole("Something went wrong in updating an user.\n ERROR " + err)
        })

    }

    /**
     * DELETE
     * deletes an user with an specific id from database
     * @param req
     * HTTP-Request containing the id of User document in the params (in the URL)
     * @param res
     * HTTP-Request containing a status code and if successful, the deleted user in its body
     */
    public delete(req: Request, res: Response): void {
        this.userModule.deleteUser(new mongoose.Types.ObjectId(req.params.id)).then((user: User | null) => {
            if (user) {
                res.status(200).send(user);
            } else {
                res.sendStatus(500);
            }
        })

    }

    /**
     * DELETE ALL USERS
     * deletes all users from database
     * @param req
     * @param res
     * HTTP-Response containing a status code an, if successful, all users, which were delete
     */
    public deleteAllUsers(req: Request, res: Response): void {
        this.userModule.deleteAllUsers().then((users: User[] | null) => {
            if (users) {
                res.status(200).send(users);
            } else {
                res.sendStatus(500);
            }
        })
    }

}
