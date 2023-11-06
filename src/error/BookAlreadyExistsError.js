const GenericError = require("./GenericError");

class BookAlreadyExistsError extends GenericError {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    return GenericError.BOOK_ALREADY_EXISTS
  }
}

module.exports = BookAlreadyExistsError;
