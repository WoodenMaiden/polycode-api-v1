import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    userName: String,
    userEmail: String,
    hashedPassword: String,

    exercices: [Number],

    inscriptionDate: Date
})

export const UserModel = model('Users', SCHEMA)