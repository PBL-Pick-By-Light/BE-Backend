import express from 'express'
import {Request, Response} from 'express'
import {userController} from '../controllers/index';
import JWT from '../modules/auth/auth.module';

export const router = express.Router({
    strict: true
})

/**
 * User Routes
 */

// POST Routes
router.post('/create', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => userController.create(req, res))
})

router.post('/update/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => userController.update(req, res))
})

// GET Routes
router.get('/getAll', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => userController.getAllUsers(req,res))
})

router.get('/getByName/:name', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => userController.getByName(req,res))
})

router.get('/read/:jwt', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => userController.read(req,res))
})

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => userController.delete(req, res))
})
