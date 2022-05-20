import 'dotenv/config'
import { connect } from 'mongoose';
import express, { Express } from "express";

//middlewares
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';'cookie-parser'
import cors from 'cors'

import { checkDTO } from './middlewares/checkDTO';
import { jwtAuth } from './middlewares/jwtAuth';

import { userController, exerciseController, emailVerificationController } from  './controllers'
import { jwtAdminAuth } from './middlewares/jwtAdminAuth';
import { sendEmailVerif } from './middlewares/sendEmailVerif';
import { checkVerification } from './middlewares/checkVerification';

const app: Express = express();

const jsonparse = bodyParser.json()

//app middlewares
app.use(cookieParser())
app.use(cors({origin: '*'}))

//user
app.post('/user', jsonparse, checkDTO, userController.post, sendEmailVerif)
app.get('/user/:name', userController.get)
app.delete('/user/:name', jwtAuth, userController.delete)
app.patch('/user/:name/:toChange/:value', jwtAuth , jwtAdminAuth, jsonparse, checkDTO, userController.patch)
app.post('/login', jsonparse, checkDTO, checkVerification, userController.login)

//exercice
app.post('/exercise', jsonparse, checkDTO, jwtAdminAuth, exerciseController.post)
app.get('/exercise/:id', exerciseController.get)
app.delete('/exercise/:id', jwtAdminAuth, exerciseController.delete)
app.patch('/exercise/:id/:toChange/:value', jwtAdminAuth, exerciseController.patch)

//course
app.get('/course', exerciseController.getCourses)
app.get('/course/:name', exerciseController.getCourse)
app.get('/course/:name/exercises', exerciseController.getExercises)
app.patch('/course/:name/:toChange/:value', jwtAdminAuth, exerciseController.patchCourse)
app.post('/answer/:name/:id', jsonparse, checkDTO, exerciseController.answer) //name === username just as above

app.get('/verif/:link', emailVerificationController.get)

app.listen(process.env.PORT || 80, async () => {
    if (!process.env.MONGODB_URI || !process.env.SENDIN_BLUE_API_KEY|| !process.env.SECRET || !process.env.RUNNER_URL) {
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

