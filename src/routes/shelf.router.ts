import express from 'express'
import { Request, Response} from 'express'
import {shelfController} from '../controllers';
import JWT from "../modules/auth/auth.module";

export const router = express.Router({
    strict: true
})

/**
 * Shelf Routes
 */

// POST Routes
router.post('/create', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => shelfController.create(req, res))
})

router.post('/update/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => shelfController.update(req, res))
    //shelfController.update(req, res)
})

// GET Routes
router.get('/getAll', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => shelfController.getAllShelves(req, res))
    //shelfController.getAllShelves(req, res)
})

router.get('/findById/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => shelfController.read(req, res))
    //shelfController.read(req, res)
})

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => shelfController.delete(req, res))
    //shelfController.delete(req, res)
})
