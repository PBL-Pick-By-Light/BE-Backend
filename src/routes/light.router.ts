import express from "express";
import {lightController} from "../controllers";
import JWT from "../modules/auth/auth.module";

export const router = express.Router({
    strict: true
})
 //

/**
 * Light Routes
 */

router.post("/turnOn", (req: express.Request, res: express.Response)=>{
    JWT.authenticate(req, res, ()=>{ lightController.turnOn(req, res)})
})

router.post("/turnOff", (req: express.Request, res: express.Response)=>{
    JWT.authenticate(req, res, () => lightController.turnOff(req, res))
})