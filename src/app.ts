import 'dotenv/config'
import { connect } from 'mongoose';
import express, { Express, Request, Response } from "express";

import {UserModel} from './model/user'

const app: Express = express();

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

