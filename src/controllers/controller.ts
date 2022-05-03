import { Response, Request } from 'express'


export default interface Controller {
    get(req: Request, res: Response): void;
    post(req: Request, res: Response): void
    patch(req: Request, res: Response): void;
    put(req: Request, res: Response): void;
    delete(req: Request, res: Response): void;
}