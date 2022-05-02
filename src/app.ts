import 'dotenv/config'
import { connect } from 'mongoose';

import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser';
import { checkDTO } from './middlewares/checkDTO';

import { userController } from  './controllers'


const app: Express = express();

const jsonparse = bodyParser.json()

//user
app.post('/user', jsonparse, checkDTO, userController.post)

app.listen(process.env.PORT || 80, async () => {
    if (!process.env.MONGODB_URI || !process.env.SECRET) {
        console.log("Please fill environment variables")
        process.exit(1);
    }

    try {
        await connect(process.env.MONGODB_URI)
        console.log("Launched")
    }
    catch (e) {
        console.log(e)
    }
})

