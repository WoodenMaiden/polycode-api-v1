import * as jwt from 'jsonwebtoken'
import { Response, Request, NextFunction } from "express";

import { UserModel } from "../model/user";
import { EVModel } from "../model/emailVerification";

export async function checkVerification(req: Request, res: Response, next: NextFunction) {    
    try {
        const usr: any = await UserModel.findOne({userName: req.body.userName}).exec()
        const verify: any = await EVModel.findOne({userEmail: usr.userEmail}).exec();
        if (!verify) next()
        else res.status(403).send({message: "Verify your email address"});
    } catch(e) {
        res.status(400).send({message: "User doesn't exists"})
    }
       
}