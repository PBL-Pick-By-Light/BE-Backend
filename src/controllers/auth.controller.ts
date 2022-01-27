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

export class AuthController {
    userModule: UserModule;
    ldapModule: LDAPModule;

    constructor(mongo: MongoModule, ldap: LDAPModule ){
        this.userModule = new UserModule(mongo);
        this.ldapModule = ldap;
    }

    public loginLDAP(req: Request, res: Response): void {
        const user = this.verifyCredentials(req.body)
        /* TODO: Should be checked if connection to ldap server
           is possible so no timeout exception is thrown,
           currently a timeout exeption is awaited
           Not sure if this is possible with ldap-authentication
           but i've seen ldap-authentication is build upon ldapjs
           maybe ldapjs could be used directly instead */
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
        const jsonUser = this.verifyCredentials(req.body)
        this.userModule.getUserByName(jsonUser.name)
        .then((user) => {
            if (user === null) {
                throw new Error("Wrong Credentials")
            } else {
                user._id && this.userModule.removeJWT(user._id)
                hashString.encode(jsonUser.password, user.salt)
                .then((generatedHash) => {
                    if (generatedHash == user.password) {
                        const token = jwt.sign({"name": jsonUser.name}, jwtkey, {
                            expiresIn: expirationTime
                        })
                        res.status(200)
                        res.send({
                            "method": "local",
                            "token": token
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
        const user = this.verifyCredentials(req.body)
        user.role = this.verifyRole(req.body.role)
        if(user == null) return
        hashString.encode(user.password, salt).then((passwordHash) => {
            this.userModule.createUser(
                new UserClass(
                    user.name,
                    salt,
                    passwordHash,
                    user.role
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
     * This function verifies the json data passed to it
     * only validated the passed in username and passwords
     * @param {*} jsonUser passed in json object from frontend
     * @returns {*} {User} returns verified user object
     */
    private verifyCredentials(jsonUser: any) : User {
        let user = {
            name: '', 
            password: '', 
            jwt: '', 
            role: ''
        } as User
        user.name = this.verifyUsername(jsonUser.name)
        user.password = this.verifyPassword(jsonUser.password)
        return user
    }

    /**
     * This function verifies the json property passed to it
     * @param username passed in object from Json
     * @returns string username verified or throws error
     */
    private verifyUsername(username: any): string {
        let verifiedUsername: string
        if (typeof username === 'string') {
            verifiedUsername = username
            return verifiedUsername
        } else {
            throw new Error('No name Provided')
        }
    }

    /**
     * This function verifies the json property passed to it
     * @param password passed in object from Json
     * @returns string password verified or throws error
     */
    private verifyPassword(password: any): string {
        let verifiedPassword: string
        if (typeof password === 'string') {
            verifiedPassword = password
            return verifiedPassword
        } else {
            throw new Error('No password Provided')
        }
    }

    /**
     * This function verifies the json property passed to it
     * @param jwtString passed in object from Json
     * @returns string jwtString verified or throws error
     */
    private verifyJwt(jwtString: any): string {
        let verifiedJwt: string
        if (typeof jwtString === 'string') {
            verifiedJwt = jwtString
            printToConsole(jwt.verify(verifiedJwt, jwtkey))
            return verifiedJwt
        } else {
            throw new Error('No jwt Provided')
        }
    }

    /**
     * This function verifies the json property passed to it
     * @param role passed in object from Json
     * @returns string role verified or throws error
     */
    private verifyRole(role: any): string {
        let verifiedRole: string
        if (typeof role === 'string') {
            verifiedRole = role
            return verifiedRole
        } else {
            throw new Error('No admin state Provided')
        }
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
