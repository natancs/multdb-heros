import { ICrud } from "../interfaces/interfaceCrud.js"

export class ContextStrategy extends ICrud {
  constructor(strategy) {
    super()
    this._database = strategy
  }

  create(item) {
    return this._database.create(item)
  }

  read(id, skip, limit) {
    return this._database.read(id, skip, limit)
  }

  update(id, item, upsert = false) {
    return this._database.update(id, item, upsert)
  }

  delete(id) {
    return this._database.delete(id)
  }

  isConnected() {
    return this._database.isConnected()
  }

  static connect() {
    return this._database.connect()
  }
}