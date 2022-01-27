import express from 'express'
import {Request, Response} from "express";
import {languageController} from "../controllers";

export const router = express.Router({
    strict: true
})

/**
 * Language Routes
 */

// POST Routes
router.post('/create', (req: Request, res: Response) => {
    languageController.create(req, res)
})

router.post('/update/:id', (req: Request, res: Response) => {
    languageController.update(req, res)
})


// GET Routes
router.get('/getAll', (req: Request, res: Response) => {
    languageController.getAll(req, res)
})

router.get('/findByName/:lang', (req: Request, res: Response) => {
    languageController.findByName(req, res)
})

router.get('/findById/:id', (req: Request, res: Response) => {
    languageController.read(req, res)
})

// DELETE Routes
router.delete('/delete/:id', (req: Request, res: Response) => {
    languageController.delete(req, res)
})
