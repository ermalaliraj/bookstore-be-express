const GenericError = require("./GenericError");

class CouldNotFindBook extends GenericError {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    return GenericError.COULD_NOT_FIND_BOOK
  }
}

module.exports = CouldNotFindBook;
