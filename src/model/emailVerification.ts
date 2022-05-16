import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    registrationDate: {type: Date},
    userEmail: { type: String, index: { unique: true }},
    link: { type: String, index: { unique: true }}
})

export const EVModel = model('emailVerification', SCHEMA)