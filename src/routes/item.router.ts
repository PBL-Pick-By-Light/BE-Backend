import express from 'express'
import {Request, Response} from 'express'
import {itemController} from '../controllers';
import {printToConsole} from"../modules/util/util.module";
import JWT from '../modules/auth/auth.module';

export const router = express.Router({
    strict: true
})

/**
 * Item Routes
 */

printToConsole("itemRouter in use");

// POST Routes
router.post('/create', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => itemController.create(req, res))
})

router.post('/update/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => itemController.update(req, res))
})


router.post('/findByLabel', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => itemController.findByLabel(req, res))
})

// GET Routes
router.get('/getAll', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => itemController.getAll(req,res))
})

router.get('/findById/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => itemController.read(req,res))
})

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => itemController.delete(req, res))
})
