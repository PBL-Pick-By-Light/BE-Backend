import express, { Request, Response} from 'express'
import { authController } from '../controllers'
import JWT from '../modules/auth/auth.module';

export const router = express.Router({
    strict: true
})

/**
 * Authentication Routes
 *  notice that the login request doesn't need to be authenticated
 *  this is to avoid login being impossible - you can't authenticate yourself before being logged in
 */

// POST Routes
router.post('/register', (req: Request, res: Response) => {
    authController.register(req, res)
})

router.post('/login', (req: Request, res: Response) => {
    authController.loginLDAP(req, res)
})

router.post('/logout', (req: Request, res: Response) => {
    JWT.authenticate(req, res, () => authController.logout(req, res))
})

router.delete('/delete/:id', ((req: Request, res: Response) => {
    JWT.authenticate(req, res, () => authController.delete(req, res))
}))

