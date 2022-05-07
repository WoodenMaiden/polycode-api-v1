import * as jwt from 'jsonwebtoken'
import { Response, Request, NextFunction } from "express";

export function jwtAdminAuth(req: Request, res: Response, next: NextFunction) {
    
    const AUTHORIZATION = req.headers.authorization
    if ((req.params.toChange && req.params.toChange !== "admin")) next()
    else {
        if (AUTHORIZATION){
            if (AUTHORIZATION.match(/bearer\s+(\S+)/i)){
                const TOKEN = AUTHORIZATION.split(' ')[1]
                jwt.verify(TOKEN, process.env.SECRET, function(err, pld) {
                    if (err) res.status(403).send({
                        message: "Token not valid"
                    })
                    else 
                    if (!pld.admin) res.status(403).send({
                            message: "You are not an admin"
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
}