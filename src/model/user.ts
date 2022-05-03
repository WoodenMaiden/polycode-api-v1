import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    userName: { type: String, index: { unique: true }},
    userEmail: { type: String, index: { unique: true }},
    hashedPassword: String,

    exercices: [Number],

    inscriptionDate: Date
})

export const UserModel = model('Users', SCHEMA)