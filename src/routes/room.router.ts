import express from 'express'
import { Request, Response} from 'express'
import { roomController} from '../controllers/index';
import JWT from "../modules/auth/auth.module";

export const router = express.Router({
    strict: true
})

/**
 * Room Routes
 */

// POST Routes
router.post('/create', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => roomController.create(req, res))
})

router.post('/update/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => roomController.update(req, res))
})

// GET Routes
router.get('/getAll', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => roomController.getAll(req, res))

})

router.get('/findById/:id', ((req: Request, res: Response) => {
    JWT.authenticate(req, res, () => roomController.read(req, res,))
}))

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => roomController.delete(req, res))
})
