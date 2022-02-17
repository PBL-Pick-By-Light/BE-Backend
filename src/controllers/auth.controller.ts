import { Request, Response } from "express";
import { User, UserClass } from '../models/user.model';
import { UserModule } from "../modules/entities/user.module";
import { MongoModule } from "../modules/mongo/mongo.module";
import { jwtkey, expirationTime } from "../config/constants";
import jwt from "jsonwebtoken";
import { hashString } from "../modules/auth";
import { LDAPModule} from  "../modules/auth/ldap.module";
import mongoose from "mongoose";
import { printToConsole } from "../modules/util/util.module";
import config from 'config';

export class AuthController {
    userModule: UserModule;
    ldapModule: LDAPModule;

    constructor(mongo: MongoModule, ldap: LDAPModule ){
        this.userModule = new UserModule(mongo);
        this.ldapModule = ldap;
    }

    public loginLDAP(req: Request, res: Response): void {

        if (config.get('disableLDAP') == "true"){
            this.login(req, res);
            return
        }

        const user = req.body.name.trim()
        this.ldapModule.verify(user.name, user.password).then(isValid => {
            if (!isValid) {
                this.login(req, res)
            } else {
                const token = jwt.sign({"name": user.name}, jwtkey, {
                    expiresIn: expirationTime
                })
                res.status(200)
                res.send({
                    "method": "ldap",
                    "token": token
                })
            }
        }).catch((err:any) => {
            printToConsole(err)
            this.login(req, res)
        })
    }

    /**
     * This function handels the passed data by the User 
     * while login process
     * @param {Request} req data passed in by user
     * @param {Response} res data send back to user
     */
    public login(req: Request, res: Response): void {
        const jsonUser = req.body.name
        if (!jsonUser || jsonUser == ""){
            res.status(400).send("Username missing")
            return
        }
        const password = req.body.password
        if (!password || password == ""){
            res.status(400).send("Password missing")
            return
        }
        this.userModule.getUserByName(jsonUser)
        .then((user) => {
            if (user === null ) {
                res.status(403).send("Wrong Credentials")
                return
            } else {
                user._id && this.userModule.removeJWT(user._id)
                const salt: string = user.salt!
                hashString.encode(password.trim(), salt)
                .then((generatedHash) => {
                    if (generatedHash == user.password) {
                        const token = jwt.sign({"name": jsonUser}, jwtkey, {
                            expiresIn: expirationTime
                        })
                        res.status(200)
                        res.send({
                            "method": "local",
                            "token": token,
                            "role" : user.role
                        })
                    } else {
                        res.status(403)
                        res.send({
                            "message": "Password wrong",
                        })
                    }
                })
            }
        })
        .catch((err:any) => {
            printToConsole(err)
            res.status(403)
            res.send({
                "message": "Wrong Credentials",
            })
        })
    }


    /**
     * This function verifies the sent data for
     * a registration and creates a new database
     * entry if the data is correct.
     * @param {Request} req data send by the user
     * @param {Response} res data send to the user back
     */
    public register(req: Request, res: Response): void {
        const salt = hashString.getSalt()
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
            ).then((id) => {
                res.status(201).send(id)
            }).catch((err: Error) => {
                res.status(409)
                res.send({
                    "message" : {
                        "error" : err.message
                    }
                })
            })
        })
    }

    /**
     * This function deletes the sessionCookie so that the user
     * is not recognised by the Backend anymore
     * @param {Request} req data recieved from the user
     * @param {Response} res data send back to the user
     */
    public async logout(req: Request, res: Response): Promise<void> {
        const authHeader = req.headers.authorization
        authHeader && jwt.verify(authHeader, jwtkey, async (err: jwt.VerifyErrors | null, decoded: any) => {
            if(err) {
                res
                .status(401)
                .send({
                    success: false,
                    message: err.message
                })
                return
            }
            let userObj: User | null = await this.userModule.getUserByName(decoded.name);
            if(userObj) {
                printToConsole(authHeader)
                const updatedUserObj = userObj
                updatedUserObj.jwt = authHeader
                printToConsole(updatedUserObj)
                userObj._id && await this.userModule.updateUser(userObj._id, updatedUserObj);
                res
                .status(200)
                .send({
                    'message': 'logged out successfully'
                })
            } else {
                res
                .status(400)
                .send({
                    'message': 'error in logging out'
                })
            }
        })
    }

    /**
     * Deletes the user
     */
    public delete(req: Request, res: Response){
        if(!(req.params.id)){
            return res.status(400).send("no id given")
        }
        return this.userModule.deleteUser(new mongoose.Types.ObjectId(req.params.id)).then((user: User| null)=>
            res.status(200).send(user)
        ).catch((err)=>{
            res.status(500).send(err);
        })
    }
}
