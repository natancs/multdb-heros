import { config } from "dotenv"
import { join, dirname } from "node:path"
import { ok } from "node:assert"
import { fileURLToPath } from "node:url"

export function dotenv() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const env = process.env.NODE_ENV || "dev"

  const configPath = join(__dirname, "..", "..", "config", `.env.${env}`)

  ok(env === "prod" || env === "dev", "a env é invalida, ou dev ou prod")

  return config({
    path: configPath
  })
}