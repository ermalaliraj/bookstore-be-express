class GenericError extends Error {
  static GENERIC_APPLICATION_ERROR = 0;
  static COULD_NOT_FIND_BOOK = 1;
  static BOOK_ALREADY_EXISTS = 1;

  constructor() {
    super();
    this.message = "Generic Application error!"
  }

  getCode() {
    return GenericError.GENERIC_APPLICATION_ERROR
  }
}
module.exports = GenericError;