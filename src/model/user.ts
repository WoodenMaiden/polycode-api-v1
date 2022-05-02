import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    //userEmail: string
    _id: String,

    userName: String,
    hashedPassword: String,

    exercices: [Number],

    inscriptionDate: Date
})

export const UserModel = model('Users', SCHEMA)