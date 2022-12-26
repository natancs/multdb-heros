import {
  describe,
  beforeAll,
  test,
  expect
} from "@jest/globals"
import api from "../index"

import { ContextStrategy } from "../db/strategies/base/contextStrategy.js"
import { Postgres } from "../db/strategies/postgres/postgres.js"
import { UserSchema } from "../db/strategies/postgres/schemas/userSchema.js"

let app = {}
const USER = {
  username: "Natanael",
  password: "123"
}
const USER_DB = {
  ...USER,
  password: "$2b$04$je2Ybxc1a8i.6dQPxoTf5.qGGx3Osref4AsMf7rSGc9g4NPc36Dl."
}

describe("Auth test suite", () => {
  beforeAll(async () => {
    app = await api
    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UserSchema)
    const context = new ContextStrategy(new Postgres(connectionPostgres, model))
    await context.update(null, USER_DB, true)
  })

  test("Deve obter um token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    expect(statusCode).toStrictEqual(200)
    expect(dados.token.length > 10).toBeTruthy()
  })

  test("deve retornar não autorizado ao tentar obter um login errado", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "Natan",
        password: "123"
      }
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    expect(statusCode).toEqual(401)
    expect(dados.error).toContain("Unauthorized")
  })
})