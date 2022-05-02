import Controller from './controller'
import { Response, Request } from 'express'
import { genSalt, hash } from 'bcrypt'

import { UserModel } from '../model/user'
import { SignUpDTO } from '../dto';

class UserController implements Controller{
    async post(req: Request, res: Response) {
        const ROUNDS: number = 12;
        const INPUT: SignUpDTO = req.body

        const EMAILREGEX = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/

        if (INPUT.password === INPUT.passwordVerify 
            && INPUT.password.length <= 72
            && INPUT.password.length >= 8) {
            
            if (!INPUT.userEmail.match(EMAILREGEX)){
                res.status(400).send({
                    message: "Please enter a valid email address"
                })
                return;
            }

            if (INPUT.userName.length < 6 || INPUT.userName.length > 20 ) {
                res.status(400).send({
                    message: "Please enter a Username between 6 and 20 characters long"
                })
                return; 
            }

            try {
                const salt: string = await genSalt(ROUNDS)
                try {
                    const hashed = await hash(INPUT.password, salt)
                    const user = new UserModel({
                        _id: INPUT.userEmail,
                        userName: INPUT.userName,
                        hashedPassword: hashed,

                        exercices: [],
                        inscriptionDate: new Date()
                    })

                    try {
                        await user.save()
                        res.status(201).send({
                            jwt: "JWTToken"
                        })
                    } catch (e) {
                        res.status(409).send({
                            message: "Failed to insert because email already exists"
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
                message : "Password does not match, or isn't of the good length (>= 8 and <= 72)"
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