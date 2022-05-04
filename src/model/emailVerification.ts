import { Schema, model } from 'mongoose'

const SCHEMA = new Schema({
    userName: { type: String, index: { unique: true }},
    userEmail: { type: String, index: { unique: true }},
    link: { type: String, index: { unique: true }}
})

export const EVModel = model('emailVerification', SCHEMA)