import {
  describe,
  test,
  expect,
  beforeAll
} from "@jest/globals"
import main from "../index.js"

let app = {}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5hdGFuYWVsIiwiaWQiOjEsImlhdCI6MTY3MTM5NzY0NX0.2vprY1Yz5rdgWAHgxnWpEtkLv-7sQ-GiWrygAkNz1HM"

const headers = {
  Authorization: TOKEN
}

const MOCK_HERO_CREATE = {
  nome: "Chapolin Colorado",
  poder: "Marreta Bionica"
}

const MOCK_HERO_INIT = {
  nome: "Batman",
  poder: "Dinheiro"
}

let MOCK_ID = ""

describe("Suite de testes da API Heros", () => {
  beforeAll(async () => {
    app = await main
    const result = await app.inject({
      method: "POST",
      url: `/heros`,
      headers,
      payload: JSON.stringify(MOCK_HERO_INIT)
    })

    const dados = JSON.parse(result.payload)

    MOCK_ID = dados._id
  })

  test("Listar /heros", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/heros",
      headers
    })
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    expect(statusCode).toEqual(200)
    expect(Array.isArray(dados)).toBeTruthy()
  })

  test("listar /heros - deve retornar somente 3 registros", async () => {
    const TAMANHO_LIMIT = 3
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/heros?skip=0&limit=${TAMANHO_LIMIT}`
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    expect(statusCode).toEqual(200)
    expect(dados.length === TAMANHO_LIMIT).toBeTruthy()
  })

  test("listar /heros - não deve retornar registros caso query invalida", async () => {
    const TAMANHO_LIMIT = "Ae"
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/heros?skip=0&limit=${TAMANHO_LIMIT}`
    })

    const statusCode = result.statusCode

    expect(statusCode).toEqual(400)
  })

  test("listar GET - /heros - deve filtrar um item", async () => {
    const NAME = MOCK_HERO_INIT.nome
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/heros?nome=${NAME}&skip=0&limit=1000`
    })

    const [dados] = JSON.parse(result.payload)
    const statusCode = result.statusCode

    expect(statusCode).toEqual(200)
    expect(dados.nome).toEqual(NAME)
  })

  test("Cadastrar POST - /heros", async () => {
    const result = await app.inject({
      method: "POST",
      url: `/heros`,
      headers,
      payload: JSON.stringify(MOCK_HERO_CREATE)
    })

    const statusCode = result.statusCode
    const { message, _id } = JSON.parse(result.payload)

    expect(statusCode === 200).toBeTruthy()
    expect(_id).not.toBeUndefined()
    expect(message).toEqual("Heroi cadastrado com sucesso!")
  })

  test("Atualizar PATCH - /heros/:id", async () => {
    const _id = MOCK_ID
    const expected = {
      poder: "Super Mira"
    }
    const result = await app.inject({
      method: "PATCH",
      headers,
      url: `/heros/${_id}`,
      payload: JSON.stringify(expected)
    })

    const statusCode = result.statusCode
    const { message } = JSON.parse(result.payload)

    expect(statusCode === 200).toBeTruthy()
    expect(message).toEqual("Heroi atualizado com sucesso!")
  })

  test("Atualizar PATCH - /heros/:id - não deve atualizar com ID incorreto", async () => {
    const _id = `63971ab66b4c867c80472a57`
    const expected = {
      poder: "Super Mira"
    }
    const result = await app.inject({
      method: "PATCH",
      headers,
      url: `/heros/${_id}`,
      payload: JSON.stringify(expected)
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)
    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID Não encontrado no banco'
    }

    expect(statusCode === 412).toBeTruthy()
    expect(dados).toEqual(expectedError)
  })

  test("Remover DELETE - /heros/:id", async () => {
    const _id = MOCK_ID
    const result = await app.inject({
      method: "DELETE",
      headers,
      url: `/heros/${_id}`
    })

    const statusCode = result.statusCode
    const { message } = JSON.parse(result.payload)

    expect(statusCode === 200).toBeTruthy()
    expect(message).toEqual("Heroi removido com sucesso!")
  })

  test("Remover DELETE - /heros/:id - não deve remover com ID incorreto", async () => {
    const _id = `63971ab66b4c867c80472a57`
    const result = await app.inject({
      method: "DELETE",
      headers,
      url: `/heros/${_id}`
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID Não encontrado no banco'
    }

    expect(statusCode === 412).toBeTruthy()
    expect(dados).toEqual(expectedError)
  })
})