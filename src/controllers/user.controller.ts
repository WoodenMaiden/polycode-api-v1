import Controller from './controller'
import { Response, Request } from 'express'
import { genSalt, hash } from 'bcrypt'

import { UserModel } from '../model/user'

class UserController implements Controller{
    async post(req: Request, res: Response) {
        const ROUNDS: number = 12;

        if (req.body.password === req.body.passwordVerify 
            && req.body.password.length <=72) {

            try {
                const salt: string = await genSalt(ROUNDS)
                try {
                    const hashed = await hash(req.body.password, salt)
                    const user = new UserModel({
                        userName: req.body.userName,
                        userEmail: req.body.userEmail,
                        hashedPassword: hashed,

                        exercices: [],
                        inscriptionDate: new Date()
                    })

                    try {
                        await user.save()
                        
                        res.status(201).send()
                    } catch (e) {
                        res.status(500).send({
                            message: "Database connection failed"
                        })
                    }
                } catch (e) {
                    res.status(500).send({
                        message: "Failed to hash, please contact us ASAP!"
                    })
                }
            } catch (e) {
                res.status(500).send({
                    message: "Failed to generate salt for hashing, please contact us ASAP!"
                })
            }
            
        }
        else {
            res.status(400).send({
                message : "Password does not match"
            })
        }
    }
    get(req: Request, res: Response): void {
        throw new Error('Method not implemented.')
    }
    patch(req: Request, res: Response): void {
        throw new Error('Method not implemented.')
    }
    put(req: Request, res: Response): void {
        throw new Error('Method not implemented.')
    }
    delete(req: Request, res: Response): void {
        throw new Error('Method not implemented.')
    }
}
const userController = new UserController()

export { userController }