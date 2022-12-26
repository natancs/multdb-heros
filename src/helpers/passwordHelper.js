import { hashSync, compareSync } from "bcrypt"

const SALT = parseInt(process.env.SALT_PWD)

export class PasswordHelper {
  static hashPassword(pass) {
    return hashSync(pass, SALT)
  }

  static comparePassword(pass, hash) {
    return compareSync(pass, hash)
  }
}