import * as jwt from 'jsonwebtoken'
import { Response, Request, NextFunction } from "express";

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
    //cases when this should be ignored

    const AUTHORIZATION = req.headers.authorization
    if (AUTHORIZATION){
        if (AUTHORIZATION.match(/bearer\s+(\S+)/i)){
            const TOKEN = AUTHORIZATION.split(' ')[1]
            jwt.verify(TOKEN, process.env.SECRET, function(err, pld) {
                if (err) res.status(403).send({
                    message: "Token not valid"
                })
                else if (pld.usr !== req.params.name && pld.admin !== true) res.status(403).send({
                    message: "You are not allowed to do that"
                })
                else next()
            })
        }
        else {
            res.status(401).send({
                message: "Missing token"
            })
        }
    } else {
        res.status(401).send({
            message: "Missing Authorization header"
        })
    }
}