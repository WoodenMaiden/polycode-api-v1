import axios from "axios";
import { randomUUID } from "crypto";
import { Response, Request, NextFunction } from "express";

import { EVModel } from "../model/emailVerification";

export async function sendEmailVerif(req: Request, res: Response, next: NextFunction) {

    const LINK = randomUUID()
    const ENTRY = new EVModel({
        registrationDate: new Date(),
        userEmail : req.body.userEmail,
        link: LINK
    })
    
    try {
        await ENTRY.save()

        await axios.post("https://api.sendinblue.com/v3/smtp/email", JSON.stringify({
            sender: {
                name: "Yann from Polycode",
                email: "no-reply@polycode.yann-pomie.fr"
            },
            to: [{
                email: req.body.userEmail,
                name: req.body.userName
            }],
            subject: "Verify your Polycode Email Address",
            htmlContent: /*html*/`<html><head></head><body>
                            <h1>Hi ${req.body.userName} and welcome to Polycode!</h1>
                            <p>Your registration isn't complete however, 
                            in order to dispose of spams we proceed to verify new user's emails.
                            Please click this link: "http://polycode.yann-pomie.fr/verif/${LINK} to verify it 
                            <strong>or else the account will not be accessible until you do</strong></p>
                            <p>Sincerely yours</p>
                            <p>Yann POMIE</p>
                            <em>Do not respond to this email</em>
                            </body></html>`
        }), {
            headers : {
                'Accept' : "application/json",
                'Content-Type': "application/json",
                'api-key': process.env.SENDIN_BLUE_API_KEY
            }
        })
        res.status(204).send()
    } catch(e) {
        console.log("Sendinblue api call failed!!!")
    }
}