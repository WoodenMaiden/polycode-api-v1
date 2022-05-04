import 'dotenv/config'
import { connect } from 'mongoose';
import express, { Express } from "express";

//middlewares
import bodyParser from 'body-parser';
import cors from 'cors'

import { checkDTO } from './middlewares/checkDTO';
import { jwtAuth } from './middlewares/jwtAuth';

import { userController } from  './controllers'
import { jwtAdminAuth } from './middlewares/jwtAdminAuth';

const app: Express = express();

const jsonparse = bodyParser.json()

//app middlewares
app.use(cors())

//user
app.post('/user', jsonparse, checkDTO, userController.post)
app.get('/user/:name', userController.get)
app.delete('/user/:name', jwtAuth, userController.delete)
app.patch('/user/:name/:toChange/:value', jwtAuth , jwtAdminAuth, jsonparse, checkDTO, userController.patch)
app.get('/login', jsonparse, checkDTO, userController.login)

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

