import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    language: String,
    
    title: String,
    statement: String, // markdown goes here
    relatedCourse: {type: String, index: true },

    inputs: [String], //there can be several inputs per exercice
    expectedOutputs: [String], //inputs[n] => expectedOutputs[n]

    keyWords: [String],
    initialCode: String
})

export const ExerciseModel = model('Exercise', SCHEMA)