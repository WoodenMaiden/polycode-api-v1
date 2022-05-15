import Controller from './controller'

import axios from 'axios';
import { Response, Request } from 'express'

import { ExerciseModel } from '../model/exercise';

class ExerciseController implements Controller{  
    async get(req: Request, res: Response){
        try {
            const found = await ExerciseModel.findById(req.params.id) 
            res.status(200).send(found)
        } catch(e) {
            res.status(404).send({
                message: "Exercise not found"
            })
        }
    }
    
    async post(req: Request, res: Response){
        try {
            const INPUT = req.body
            if (INPUT.inputs.length < 1 
                || INPUT.expectedOutputs.length < 1 
                || INPUT.expectedOutputs.length !== INPUT.inputs.length
                || !INPUT.relatedCourse
                || !INPUT.language
                || INPUT.title.length < 1
                || INPUT.statement.length < 1) {
                    res.status(400).send({
                        message: "Exercice contents invalid"
                    })   
                }
            const toInsert = new ExerciseModel(INPUT)
            await toInsert.save()
            res.status(204).send({
                message: "inserted"
            })
        } catch(e) {
            res.status(500).send({
                message: "Failed to insert"
            })
        }
    }

    async answer(req: Request, res: Response){
        const USER: string = req.params.name 
        const EXERCISE: string = req.params.id
        const INPUT = req.body
        const JWT = req.headers.authorization

        const HEADERS: Record<string, any> = {
            headers: {
                Authorization: JWT
            }
        }

        try {
            const RESPONSE: Record<string, any> = 
                await (await axios.post(process.env.RUNNER_URL, INPUT)).data

            try {
                if (RESPONSE.completed) {
                    
                    const PAYLOAD = { "original": EXERCISE,"confirm" : EXERCISE }

                    await axios.patch(`http://localhost:${process.env.PORT}/user/${USER}/addExercise/${EXERCISE}`,
                        PAYLOAD, HEADERS)
                    res.status(200).send({
                        message: `Completed exercice ${EXERCISE} and registered its completion`,
                        ...RESPONSE
                    })
                } else{
                    res.status(200).send({
                        message: `you failed`,
                        ...RESPONSE
                    })
                }
            } catch(e) {
                console.log(e)
                res.status(500).send({
                    message: "Could not add exercice completion to database"
                })
            }
        } catch(e) {
            res.status(500).send({
                message: "Couldn't send your answer to the runners"
            })
        }
    }
    
    async patch(req: Request, res: Response){
        const [ ressource, toChange, value ] = [ req.params.id, req.params.toChange , req.params.value ]
        const changeable: string[] = ["language", "title", "statement", "inputs", "expectedOutputs", "addKeyword", "delKeyword"]
        let found
        try {
            found = await ExerciseModel.findById(ressource).exec()
        } catch (e) {
            res.status(404).send({
                message: "Not found"
            })
            return 
        }

        try {
            if(!changeable.includes(toChange)) res.status(400).send({
                message: "Wrong thing to change"
            })
            else if (toChange === "addKeyword") {
                await ExerciseModel.findByIdAndUpdate(ressource, { keyWords: found.keyWords.concat(value) }).exec()  
                res.status(204).send()
            }
            else if (toChange === "delKeyword") {
                await ExerciseModel.findByIdAndUpdate(ressource, { keyWords: found.keyWords.filter((elt: string) => elt !== value) }).exec()  
                res.status(204).send()
            } 
            else if (toChange === "inputs" || toChange === "expectedOutputs") {        
                if(toChange === "inputs") await ExerciseModel.findByIdAndUpdate(ressource, { inputs: [value] }).exec()  
                else await ExerciseModel.findByIdAndUpdate(ressource, { expectedOutputs: [value] }).exec()
                res.status(204).send()
            } 
            else {
                if (toChange === "language") 
                    await ExerciseModel.findByIdAndUpdate(ressource, { language: value }).exec()
                else if (toChange === "title") 
                    await ExerciseModel.findByIdAndUpdate(ressource, { title: value }).exec()
                else if (toChange === "statement") 
                    await ExerciseModel.findByIdAndUpdate(ressource, { title: value }).exec()
                res.status(204).send()
            }
        } catch (e) {
            res.status(500).send({
                message: "Failed to change"
            })
        }
    }

    async patchCourse(req: Request, res: Response){
        res.status(203).send()
    }

    async delete(req: Request, res: Response){
        const TO_DEL : string = req.params.id
        try {
            const found = await ExerciseModel.findOneAndDelete({_id: TO_DEL})
            res.status(204).send()
        } catch(e) {
            res.status(400).send({
                message: 'Could not delete'
            })
        }
    }
}

const exerciseController = new ExerciseController()

export { exerciseController }