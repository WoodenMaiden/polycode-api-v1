import Controller from './controller'

import { Response, Request } from 'express'

import { ExerciseModel } from '../model/exercise'

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
    
    async patch(req: Request, res: Response){
        res.status(204).send()
    }

    async delete(req: Request, res: Response){
        res.status(204).send()
    }
}

const exerciseController = new ExerciseController()

export { exerciseController }