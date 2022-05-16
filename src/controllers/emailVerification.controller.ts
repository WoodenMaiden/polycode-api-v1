import { Response, Request, NextFunction } from 'express'
import Controller from "./controller";

import { EVModel } from '../model/emailVerification'

class EmailVerificationController implements Controller {
    async get(req: Request, res: Response){
        try {
            await EVModel.deleteOne({link: req.params.link}) 
        } catch (e) {
            res.status(500).send({
                message: "Could not verify"
            })
        }
    }
    patch(req: Request, res: Response){
        throw new Error()
    }
    delete(req: Request, res: Response){
        throw new Error()
    }
    post(req: Request, res: Response, next: NextFunction){
        throw new Error()
    }
}

const emailVerificationController = new EmailVerificationController()

export { emailVerificationController }