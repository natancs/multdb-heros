import Mongoose, { Schema, } from "mongoose"

const heroSchema = new Schema({
  nome: {
    type: String,
    require: true
  },
  poder: {
    type: String,
    require: true
  },
  inserteAt: {
    type: Date,
    default: new Date()
  }
})

export const herosSchema = Mongoose.model('heros', heroSchema)