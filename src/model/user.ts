import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    //userName: String,
    _id: String,
    userEmail: { type: String, index: { unique: true }},
    hashedPassword: String,

    exercices: [Number],

    inscriptionDate: Date
})

export const UserModel = model('Users', SCHEMA)