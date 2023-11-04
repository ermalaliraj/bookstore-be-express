const GenericError = require("./GenericError");

class BoolAlreadyExistsError extends GenericError {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    return GenericError.BOOK_ALREADY_EXISTS
  }
}

module.exports = BoolAlreadyExistsError;
