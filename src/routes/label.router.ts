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

router.get('/findByName/:name', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => labelController.findLabelByName(req, res))
})

router.get('/getLabelIdsByItemId/:id',((req: Request, res: Response) => {
    JWT.authenticate(req, res, () => labelController.getLabelIdsByItemId(req, res))
}))

router.get('/getLabelsByItemId/:id', ((req:Request, res: Response) => {
    JWT.authenticate(req, res, () => labelController.getLabelsByItemId(req, res))
}))

router.get('/findIdsByItemId/:id',((req: Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.getLabelIdsByItemId(req, res)))
}))

router.get('/findByItemId/:id', ((req:Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.getLabelsByItemId(req, res)))
}))

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => (labelController.delete(req, res)))
})
