import { Schema, model, Types } from 'mongoose'

const SCHEMA = new Schema({
    userName: { type: String, index: { unique: true }},
    userEmail: { type: String, index: { unique: true }},
    hashedPassword: String,
    admin: {type: Boolean, default: false},

    exercices: [{type: Types.ObjectId, ref: 'exercice'}],

    inscriptionDate: Date
})

export const UserModel = model('Users', SCHEMA)