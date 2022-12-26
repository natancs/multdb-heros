import Mongoose from "mongoose";

import { ICrud } from "../interfaces/interfaceCrud.js"
import { dotenv } from "../../../helpers/dotenv.js";

const STATUS = {
  0: "Disconectado",
  1: "Conectado",
  2: "Conectando",
  3: "Disconectando"
}

dotenv()

export class MongoDB extends ICrud {
  constructor(connection, schema) {
    super()
    this._schema = schema
    this._connection = connection
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState]

    if (state === "Conectado") return state

    if (state !== "Conectando") return state

    await new Promise(resolve => setTimeout(resolve, 1000))

    return STATUS[this._connection.readyState]

  }

  static async connect() {
    Mongoose.connect(`${process.env.MONGODB_URL}`, function (error) {
      if (!error) return

      console.log("Falha na conexão", error)
    })

    const connection = Mongoose.connection

    return connection
  }

  async create(item) {
    return await this._schema.create(item)
  }

  async read(item, skip = 0, limit = 10) {
    return this._schema.find(item).limit(limit).skip(skip)
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item })
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id })
  }
}