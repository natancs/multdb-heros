class NotImplementedException extends Error {
  constructor() {
    super("Not Implemented Exception")
  }
}

export class ICrud {
  create(item) {
    throw new NotImplementedException()
  }

  read(query) {
    throw new NotImplementedException()
  }

  update(id, item) {
    throw new NotImplementedException()
  }

  delete(id) {
    throw new NotImplementedException()
  }

  isConnected(id) {
    throw new NotImplementedException()
  }

  connect() {
    throw new NotImplementedException()
  }
}