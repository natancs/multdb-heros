import {
  describe,
  test,
  expect,
  beforeAll
} from "@jest/globals"

import { PasswordHelper } from "../helpers/passwordHelper.js"

const SENHA = "123"
const HASH = "$2b$04$je2Ybxc1a8i.6dQPxoTf5.qGGx3Osref4AsMf7rSGc9g4NPc36Dl."

describe("UserHelper test suite", () => {
  test("deve gerar um hash a partir de uma senha", async () => {
    const result = PasswordHelper.hashPassword(SENHA)

    expect(result.length > 10).toBeTruthy()
  })

  test("deve comparar uma senha e seu hash", async () => {
    const result = PasswordHelper.comparePassword(SENHA, HASH)

    expect(result).toBeTruthy()
  })
})