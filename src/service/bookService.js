const Book = require('../models/book')
const BookAlreadyExistsError = require('../error/BookAlreadyExistsError')
const CouldNotFindBook = require('../error/CouldNotFindBook')
const logger = require('../utils/logger')

exports.getAllBooks = async (data) => {
  let filter = {}
  if (data.id || data.title || data.author || data.price || data.stockQuantity) {
    filter.$and = []
  }
  if (data._id) {
    filter.$and.push({_id: data._id})
  }
  if (data.id) {
    filter.$and.push({title: data.title})
  }
  if (data.rank) {
    filter.$and.push({author: data.author})
  }
  if (data.price) {
    filter.$and.push({author: data.price})
  }
  if (data.stockQuantity) {
    filter.$and.push({user: data.stockQuantity})
  }

  let query = Book.find(filter)
  let books = query.exec()
  return books
}

exports.getBookById = async (bookId) => {
  console.log("bookId: ", bookId)
  const book = await Book.findById(bookId)
  if (!book) {
    throw new CouldNotFindBook("Could not find Book with id " + bookId)
  }
  return book
}

exports.createBook = async (data) => {
  // let dbBook = await Book.findById(data.title) //should search by title in a real app
  // if (dbBook !== null) {
  //   throw new BookAlreadyExistsError('Book already exists!')
  // }
  let newObject = {
    title: data.title,
    author: data.author,
    price: data.price,
    stockQuantity: data.stockQuantity
  }
  newObject = await Book.create(newObject)
  newObject = await newObject.save();
  logger.debug("Created successfully the Book: ", newObject);
  return newObject
}

exports.updateBook = async ({bookId, data}) => {
  logger.info(`cartId= ${bookId} , data=${JSON.stringify(data)}`)
  let book = await Book.findById(bookId)
  if (book.title) {
    book.title = data.title
  }
  if (book.author) {
    book.author = data.author
  }
  if (book.price) {
    book.price = data.price
  }
  if (book.stockQuantity) {
    book.stockQuantity = data.stockQuantity
  }
  book = await book.save()
  return book
}

exports.deleteBookById = async (bookId) => {
  const book = await Book.findById(bookId)
  if (!book) {
    throw new CouldNotFindBook("Could not find Book with id " + bookId)
  }

  await Book.findByIdAndDelete(bookId)
  logger.debug("Deleted successfully Book with id ", bookId);
  return true
}
