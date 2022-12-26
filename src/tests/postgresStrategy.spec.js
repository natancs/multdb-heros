import {
  describe,
  test,
  expect,
  jest,
  beforeAll
} from "@jest/globals"
import { Postgres } from "../db/strategies/postgres/postgres.js"
import { ContextStrategy } from "../db/strategies/base/contextStrategy.js"
import { herosSchema } from "../db/strategies/postgres/schemas/herosSchema.js"

const MOCK_HERO_CREATE = {
  nome: "Gavião Negro",
  poder: "Flexas"
}

const MOCK_HERO_UPDATE = {
  nome: 'Batman',
  poder: 'Dinehri'
}

let context = {}

describe("Postgres Strategy", function () {
  jest.useFakeTimers({ timerLimit: Infinity })
  beforeAll(async function () {
    const connection = await Postgres.connect()
    const model = await Postgres.defineModel(connection, herosSchema)
    context = new ContextStrategy(new Postgres(connection, model))
    await context.delete()
    await context.create(MOCK_HERO_UPDATE)
  })

  test("PostgresSQL Connection", async function () {
    const result = await context.isConnected()

    expect(result).toBeTruthy()
  })

  // test.only("Deve retornar um erro caso não consiga conectar", async () => {
  //   const newContext = await contextfalsy()
  //   const result = await newContext.isConnected()

  //   expect(result).toBeTruthy()
  // })

  test("Create", async function () {
    const result = await context.create(MOCK_HERO_CREATE)

    delete result.id

    expect(result).toEqual(MOCK_HERO_CREATE)
  })

  test("List", async function () {
    const [result] = await context.read({ nome: MOCK_HERO_CREATE.nome })

    delete result.id

    expect(result).toEqual(MOCK_HERO_CREATE)
  })

  test("Update", async function () {
    const [itemUpdate] = await context.read({ nome: MOCK_HERO_UPDATE.nome })
    const novoItem = {
      ...MOCK_HERO_UPDATE,
      nome: "Mulher Maravilha"
    }

    const [result] = await context.update(itemUpdate.id, novoItem)
    const [itemUpdated] = await context.read({ id: itemUpdate.id })

    expect(result).toEqual(1)
    expect(itemUpdated.nome).toEqual(novoItem.nome)
  })

  test("Delete by id", async function () {
    const [item] = await context.read({})

    const result = await context.delete(item.id)

    expect(result).toEqual(1)
  })
})