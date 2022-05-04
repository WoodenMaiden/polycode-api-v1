import 'dotenv/config'
import { connect } from 'mongoose';
import express, { Express } from "express";

import bodyParser from 'body-parser';
import cors from 'cors'

import { checkDTO } from './middlewares/checkDTO';

import { userController } from  './controllers'

const app: Express = express();

const jsonparse = bodyParser.json()

//app middlewares
app.use(cors())

//user
app.post('/user', jsonparse, checkDTO, userController.post)
app.get('/user/:name', userController.get)
app.delete('/user/:name', userController.delete)
app.patch('/user/:ressource/:toChange/:value', jsonparse, userController.patch)
app.get('/login', jsonparse, userController.login)

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

