import {
  describe,
  test,
  expect,
} from "@jest/globals"
import { dotenv } from "../helpers/dotenv"

describe("Function dotenv() helper", () => {
  test("Deve ser possivel pegar a PORT do arquivo .env", async () => {
    const result = dotenv()

    expect(result.parsed.PORT).toEqual("5000")
  })
})