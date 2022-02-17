import express from 'express'
import { Request, Response} from 'express'
import {labelController} from '../controllers';
import JWT from "../modules/auth/auth.module";

export const router = express.Router({
    strict: true
})

/**
 * Label Routes
 */

// POST Routes
router.post('/create', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.create(req, res)))
})

router.post('/update/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.update(req, res)))
})

// GET Routes
router.get('/getAll', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => labelController.getAll(req, res))
})

router.get('/findById/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => labelController.read(req, res))
})

router.get('/findIdsByItemId/:id',((req: Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.findLabelIdsByItemId(req, res)))
}))

router.get('/findByItemId/:id', ((req:Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.findLabelsByItemId(req, res)))
}))

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.delete(req, res)))
})
