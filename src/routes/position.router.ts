import express from 'express'
import { Request, Response} from 'express'
import {positionController} from '../controllers/index';
import JWT from "../modules/auth/auth.module";

export const router = express.Router({
    strict: true
})

/**
 * Position Routes
 */
// POST
router.post('/create', (req: Request, res: Response)=>{
    JWT.authenticate(req, res, () => positionController.create(req, res))
})

router.post('/update/:id', (req: Request, res: Response)=>{
    JWT.authenticate(req, res, () => positionController.update(req, res))
})

// GET
router.get('/getAll', (req: Request, res: Response)=>{
    JWT.authenticate(req, res, () => positionController.all(req, res))
})

router.get('/findById/:id', ((req, res) => {
    JWT.authenticate(req, res, () => positionController.read(req, res))
}))

router.get('/findByItemId/:id', (req: Request, res: Response)=>{
    JWT.authenticate(req, res, () => positionController.getPositionsByItemID(req, res))
})

//DELETE
router.delete('/delete/:id', (req: Request, res: Response)=>{
    JWT.authenticate(req, res, () => positionController.delete(req, res))
})
