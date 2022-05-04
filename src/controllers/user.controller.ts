import Controller from './controller'

import * as jwt from 'jsonwebtoken'

import { Response, Request } from 'express'
import { genSalt, hash, compare } from 'bcrypt'

import { UserModel } from '../model/user'
import { SignUpDTO, LoginDTO } from '../dto';

class UserController implements Controller{  
    private static SALTROUNDS: number = 12
    private static EMAILREGEX = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/

    async login(req: Request, res: Response) {
        const INPUT: LoginDTO = req.body

        try {

            const found = await UserModel.findOne({userName: INPUT.userName}).exec()
            const samePassword = await compare(INPUT.password, found.hashedPassword)

            if (!samePassword) throw new Error();

            res.status(200).send({
                info: found,
                jwt: jwt.sign({
                    usr: INPUT.userName,
                    admin: found.admin
                }, process.env.SECRET, {expiresIn: "2 days"} )
            })
        }
        catch (e) {
            res.status(404).send({
                message: "Wrong credentials"
            })
        }
    }


    async post(req: Request, res: Response) {
        const INPUT: SignUpDTO = req.body


        if (INPUT.password === INPUT.passwordVerify 
            && INPUT.password.length <= 72
            && INPUT.password.length >= 8) {
            
            if (!INPUT.userEmail.match(UserController.EMAILREGEX)){
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
                const salt: string = await genSalt(UserController.SALTROUNDS)
                try {
                    const hashed = await hash(INPUT.password, salt)
                    const user = new UserModel({
                        userName: INPUT.userName,
                        userEmail: INPUT.userEmail,
                        hashedPassword: hashed,

                        exercices: [],
                        inscriptionDate: new Date()
                    })

                    try {
                        await user.save()
                        res.status(201).send({
                            jwt: jwt.sign({
                                usr: INPUT.userName,
                                admin: false
                            }, process.env.SECRET, {expiresIn: "2 days"} )
                        })
                    } catch (e) {
                        res.status(409).send({
                            message: "Failed to insert because email and/or username already exists"
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
    async get(req: Request, res: Response) {
        const toGet: string = req.params.name
        let toSend: any[]
        try {
            toSend = await UserModel.findOne({userName: toGet}).exec()
            if (toSend.length > 0) res.status(200).send(toSend)
            else res.status(404).send({
                message: "No user found"
            })
        }
        catch {
            res.status(404).send({
                message: "No user found"
            })
        }
    }

    async patch(req: Request, res: Response) {
        const INPUT = req.body
         
        const [ ressource, toChange, value ] = [ req.params.name, req.params.toChange , req.params.value ]

        if(value === req.body.confirm) {
            try {
                const found: any[] = await UserModel.find({userName: ressource}).exec()
                
                if (found.length !== 1) {
                    res.status(404).send({
                        message: "User not found"
                    })
                } else {
                    const target: any = found[0]

                    switch(toChange) {
                        case 'password':
                                const salt: string = await genSalt(UserController.SALTROUNDS)
                                const hashedNew = await hash(value, salt)

                                const isTheSame: boolean = await compare(INPUT.original, target.hashedPassword)

                                if (isTheSame){
                                    await UserModel.findOneAndUpdate({userName: ressource}, {hashedPassword: hashedNew})
                                    res.status(204).send({
                                        message: "Changed"
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        message: "Wrong password"
                                    })
                                }
                            break;

                        case 'admin':
                        
                            try {
                                await UserModel.findOneAndUpdate({userName: ressource}, {admin: value})
                                res.status(204).send({
                                    message: "Changed"
                                })
                                break;
                            }
                            catch(e) {
                                res.status(500).send({
                                    message: "Could not set admin value"
                                })
                                break;
                            }
                            
                      
                        case 'username': 
                            try {
                                if (value.length < 6 || value.length > 20) {
                                    res.status(500).send({
                                        message: "User name isn't between 6 and 20 characters"
                                    })
                                }else {
                                    await UserModel.findOneAndUpdate({userName: ressource}, {userName: value})
                                    res.status(204).send({
                                        message: "Changed username"
                                    })
                                }
                                break;
                            }
                            catch(e) {
                                res.status(404).send({
                                    message: "could not change username because it alreasy exists"
                                })
                                break;
                            }
                        

                        case 'email': 
                            try {
                                if (!value.match(UserController.EMAILREGEX)){
                                    res.status(400).send({
                                        message: "Please enter a valid email address"
                                    })
                                    break;
                                }else {
                                    await UserModel.findOneAndUpdate({userName: ressource}, {userEmail: value})
                                    res.status(204).send({
                                        message: "Changed email address"
                                    })
                                }
                                break;
                            }
                            catch(e) {
                                res.status(400).send({
                                    message: "Could not change email because it already exists"
                                })
                                break;
                            }

                        case 'addExercice': 
                            try {
                                await UserModel.findOneAndUpdate({userName: ressource}, {exercices: target.exercices.concat(value)})
                                res.status(204).send({
                                    message: "Added exercice"
                                })
                                break;
                            }
                            catch (e){
                                res.status(500).send({
                                    message: "Could not add exercice"
                                })
                                break;
                            }
                        

                        default: 
                            res.status(400).send({
                                message: "Wrong thing to change"
                            })
                            break;
                    }
                }
            } catch (e) {
                res.status(500).send({
                    message: "Failed to change"
                })
            }
        }
        else {
            res.status(400).send({
                message: "Values are different!"
            })
        }
    }

    async delete(req: Request, res: Response) {
        const toDel: string = req.params.name
        try {
            const deleteCount: any = await UserModel.deleteOne({userName: toDel}).exec()
            if (deleteCount.deletedCount === 1) res.status(204).send({
                message: "Deleted"
            })
            else res.status(404).send({
                message: "Coud not delete user because it does not exists"
            })
        } catch (e) {
            res.status(400).send({
                message: "Coud not delete"
            })
        }
    }
}
const userController = new UserController()

export { userController }