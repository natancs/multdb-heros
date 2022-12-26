import { Sequelize } from "sequelize";
import { ICrud } from "../interfaces/interfaceCrud.js"
import { dotenv } from "../../../helpers/dotenv.js"

dotenv()

export class Postgres extends ICrud {
  constructor(connection, schema) {
    super()
    this._connection = connection
    this._schema = schema
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options)
    await model.sync()

    return model
  }

  async isConnected() {
    try {
      await this._connection.authenticate()
      return true
    } catch (error) {
      console.log("fail", error)
      return false
    }
  }

  static async connect() {
    const connection = new Sequelize(`${process.env.POSTGRES_URL}`, {
      quoteIdentifiers: false,
      operatorsAliases: false,
      logging: false,
      dialect: "postgres",
      ssl: process.env.SSL_DB,
      dialectOptions: {
        ssl: process.env.SSL_DB
      }
    })

    return connection
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item)
    return dataValues
  }

  async read(item = {}) {
    return await this._schema.findAll({ where: item, raw: true })
  }

  async update(id, item, upsert = false) {
    const fn = upsert ? "upsert" : "update"
    return await this._schema[fn](item, { where: { id } })
  }

  async delete(id) {
    const query = id ? { id } : {}
    return await this._schema.destroy({ where: query })
  }
}
