import { Response, Request, NextFunction } from 'express'


export default interface Controller {
    get(req: Request, res: Response): void;
    post(req: Request, res: Response,  next: NextFunction): void
    patch(req: Request, res: Response): void;
    delete(req: Request, res: Response): void;
}