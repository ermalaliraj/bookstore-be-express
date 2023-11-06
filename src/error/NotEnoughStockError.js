const GenericError = require("./GenericError")

class NotEnoughStockError extends GenericError {
  constructor(message) {
    super()
    this.message = message
  }

  getCode() {
    return GenericError.NOT_ENOUGH_STOCK
  }
}

module.exports = NotEnoughStockError
