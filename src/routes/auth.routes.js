import Joi from "joi"
import Boom from "boom"
import Jwt from "jsonwebtoken"
import { PasswordHelper } from "../helpers/passwordHelper.js"
import { BaseRoute } from "./base/base.routes.js"

const USER = {
  username: "Natanael",
  password: "4321"
}

export class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super()
    this.secret = secret
    this.db = db
  }

  _failAction(request, headers, error) {
    throw error
  }

  login() {
    return {
      path: "/login",
      method: "POST",
      options: {
        auth: false,
        tags: ["api", "login"],
        description: "Obter token",
        // note: "Faz login com user e senha do banco",
        validate: {
          failAction: this._failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
          })
        }
      },
      handler: async (request) => {
        try {
          const { username, password } = request.payload
          const [user] = await this.db.read({
            username: username
          })

          if (!user) {
            return Boom.unauthorized("O Usuário informado não existe!")
          }
          const match = PasswordHelper.comparePassword(password, user.password)

          if (!match) {
            return Boom.unauthorized("Usuário ou senha invalidos!")
          }

          const token = Jwt.sign({
            username: username,
            id: user.id
          }, this.secret)

          return {
            token
          }
        } catch (error) {
          console.log("Fail", error)

          return Boom.internal()
        }
      }
    }
  }
}