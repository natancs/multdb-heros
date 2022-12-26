import Joi from "joi"
import Boom from "boom"
import { BaseRoute } from "./base/base.routes.js"

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown()

export class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this.db = db
  }

  _failAction(request, headers, error) {
    throw error
  }

  list() {
    return {
      path: "/heros",
      method: "GET",
      options: {
        tags: ["api", "heros"],
        description: "Deve listar todos os herois ou um heroi pelo nome",
        validate: {
          failAction: this._failAction,
          query: Joi.object({
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
            nome: Joi.string().min(3).max(100)
          }),
          headers
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query
          const query = nome ? {
            nome: { $regex: `.*${nome}*.` }
          } : {}

          return this.db.read(query, skip, limit)
        } catch (error) {
          console.log("Fail", error)

          return Boom.internal()
        }
      }
    }
  }

  create() {
    return {
      path: "/heros",
      method: "POST",
      options: {
        tags: ["api"],
        description: "Must register hero by name and power",
        validate: {
          failAction: this._failAction,
          payload: Joi.object({
            nome: Joi.string().min(3).max(100).required(),
            poder: Joi.string().min(2).max(100).required()
          }),
          headers
        }
      },
      handler: async (request, headers) => {
        try {
          const { nome, poder } = request.query
          const result = await this.db.create({ nome, poder })

          return {
            _id: result._id,
            message: "Heroi cadastrado com sucesso!"
          }
        } catch (error) {
          console.log("Fail", error)

          return Boom.internal()
        }
      }
    }
  }

  update() {
    return {
      path: "/heros/{id}",
      method: "PATCH",
      options: {
        tags: ["api"],
        description: "Must update a hero by id and passing name and power",
        validate: {
          failAction: this._failAction,
          params: Joi.object({
            id: Joi.string().required()
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          }),
          headers
        }
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params
          const payload = request.payload
          const dadosString = JSON.stringify(payload)
          const dados = JSON.parse(dadosString)

          const result = await this.db.update(id, dados)

          if (result.modifiedCount !== 1) {
            return Boom.preconditionFailed("ID Não encontrado no banco")
          }

          return {
            message: "Heroi atualizado com sucesso!"
          }
        } catch (error) {
          console.log("Fail", error)

          return Boom.internal()
        }
      }
    }
  }

  delete() {
    return {
      path: "/heros/{id}",
      method: "DELETE",
      options: {
        tags: ["api"],
        description: "Must delete all database data or a hero by id",
        validate: {
          failAction: this._failAction,
          params: Joi.object({
            id: Joi.string().required()
          }),
          headers
        }
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params

          const result = await this.db.delete(id)

          if (result.deletedCount !== 1) {
            return Boom.preconditionFailed("ID Não encontrado no banco")
          }

          return {
            message: "Heroi removido com sucesso!"
          }
        } catch (error) {
          console.log("Fail", error)

          return Boom.internal()
        }
      }
    }
  }
}