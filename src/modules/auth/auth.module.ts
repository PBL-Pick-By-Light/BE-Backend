import { Request, Response, NextFunction } from "express";
import  { jwtkey } from "../../config/constants";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from 'config';
import {User} from "../../models/user.model";
import permissions from "./permissions.json";
import { UserModule } from "../entities/user.module";
import { MongoModule } from "../mongo/mongo.module";
import { printToConsole } from "../util/util.module";

//https://cloudnweb.dev/2021/05/express-typescript-basic-auth/

export class JWT {

    /**
     * check user role and get the corresponding url-array
     *  user has for some reason no role, use an empty array, so they can not access anything
     */
    private static setPermissions(role: any): string[]{
        switch(role) {
            case 'admin':
                return permissions.admin
            case 'editor':
                return permissions.editor
            case 'user':
                return permissions.user
            default:
                return []
        }
    }

    /**
     * remove parameters from url
     * e.g. if originalURL=="/labels/delete/932hi3p89h34hi" make it url=="/labels/delete/"
     * leave urls like /labels/create unchanged
     */
    private static clearUrl(url: string, params: any): string {
        if(params.id){
            return url.replace(params.id, "")
        }else if(params.name){
            return url.replace(params.name, "")
        }else if(params.lang){
            return url.replace(params.lang, "")
        }else if(params.jwt){
            return url.replace(params.jwt, "")
        } else {
            return url
        }
    }

    private static checkJwtBlacklist(user: User, jwtToken: string): boolean {
        if (!user.jwt) return false
        return user.jwt === jwtToken;

    }

    /**
     * Checks if jwt was passed in request header and verifies jwt
     * @param req express Request
     * @param res express Response
     * @param next Function to be called after successful authentication
     * @throws error message if token is invalid
     */
    authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        if (config.get('disableAuth') == "true") return next();

        const mongoModule = new MongoModule();
        const userModule = new UserModule(mongoModule);

        if (authHeader) {
            jwt.verify(authHeader, jwtkey, async (err: jwt.VerifyErrors | null, decoded: any) => {
                if(err) {
                    res
                    .status(403)
                    .send({
                        success: false,
                        message: err.message
                    })
                    return
                } 
                if(!decoded) {
                    res
                    .status(403)
                    .send({
                        success: false,
                        message: "Error with token"
                    })
                    return
                } 
                let user: User | null = await userModule.getUserByName(decoded.name)
                if (!user) {
                    res
                    .status(403)
                    .send({
                        success: false, 
                        message: "User doesn't exist in database"
                    })
                    return
                }
                if (JWT.checkJwtBlacklist(user as User, authHeader as string)) {
                    res
                    .status(406)
                    .send({
                        success: false, 
                        message: 'the used token is revoked'
                    })
                    return
                }
                
                    let urls = JWT.setPermissions((user as User).role);
                
                let url = JWT.clearUrl(req.originalUrl, req.params);
                
                /* check for url in the with the user role corresponding url-array urls
                * taken from permissions.json
                */
               printToConsole(url)
               if(urls.includes(url)) {
                   next()
                }
            })
        } else {
            res
            .status(403)
            .json({ 
                success: false, 
                message: "unauthorized"
            })
        }
    }
}

export class HashString {

    getSalt(): string {
        return crypto.randomBytes(16).toString("hex")
    }
    
    async encode(password: string, salt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'))
            })
        })
    }
}

export default new JWT()
