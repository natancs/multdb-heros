import {
  describe,
  test,
  expect,
  beforeAll,
  jest
} from "@jest/globals"
import { MongoDB } from "../db/strategies/mongodb/mongodb.js"
import { ContextStrategy } from "../db/strategies/base/contextStrategy.js"
import { herosSchema } from "../db/strategies/mongodb/schemas/herosSchema.js"

const MOCK_HERO_CREATE = {
  nome: "Mulher Maravilha",
  poder: "Laço"
}

const MOCK_HERO_DEFAULT = {
  nome: `Homem Aranha-${Date().now}`,
  poder: "Super Teia"
}

const MOCK_HERO_UPDATE = {
  nome: `Patolino-${Date().now}`,
  poder: "Velocidade"
}

let MOCK_HERO_ID = ""

let context = {}

describe("MongoDB Suite de tests", () => {

  beforeAll(async function () {
    const connection = await MongoDB.connect()
    context = new ContextStrategy(new MongoDB(connection, herosSchema))
    await context.create(MOCK_HERO_DEFAULT)
    const result = await context.create(MOCK_HERO_UPDATE)

    MOCK_HERO_ID = result._id
  })

  test("Connection", async () => {
    const result = await context.isConnected()
    const expected = "Conectado"

    expect(result).toEqual(expected)

  })

  // test("Connecting", async () => {
  //   const result = await context.isConnected()
  //   const expected = "Conectando"

  //   expect(setTimeout(() => result, 1500)).toEqual(expected)

  // })

  test("Create", async () => {
    const { nome, poder } = await context.create(MOCK_HERO_CREATE)

    expect({ nome, poder }).toEqual(MOCK_HERO_CREATE)
  })

  test("List", async () => {
    const result = await context.read({ nome: MOCK_HERO_DEFAULT.nome }, 0, 1)

    const [{ nome, poder }] = result

    expect({ nome, poder }).toEqual(MOCK_HERO_DEFAULT)
  })

  test("Update", async () => {
    const result = await context.update(MOCK_HERO_ID, { nome: "Pernalonga" })

    expect(result.modifiedCount).toEqual(1)
  })

  test("Delete", async () => {
    const result = await context.delete(MOCK_HERO_ID)

    expect(result.deletedCount).toEqual(1)
  })
})