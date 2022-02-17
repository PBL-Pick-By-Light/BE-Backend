import { Request, Response } from 'express';

/**
 * Abstract controller that provides that functionality of all controllers
 *     that implement this class correspond to the CRUD convention
 */

export abstract class CrudController {
    public abstract create(req: Request, res: Response): void
    public abstract read(req: Request, res: Response): void
    public abstract update(req: Request, res: Response): void
    public abstract delete(req: Request, res: Response): void
}
