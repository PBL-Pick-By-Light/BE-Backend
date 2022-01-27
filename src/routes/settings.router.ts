import express from 'express'
import {Request, Response} from "express";
import {settingsController} from "../controllers";
import JWT from "../modules/auth/auth.module";

export const router = express.Router({
    strict: true
})

/**
 * Settings Routes
 */

router.post('/update', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => settingsController.createOrUpdate(req, res))
})

// GET Routes
router.get('/', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => settingsController.getAll(req, res))
})
