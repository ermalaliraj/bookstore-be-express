const Book = require('../models/book')
const CouldNotFindBook = require('../error/CouldNotFindBook')
const logger = require('../utils/logger')

exports.getAllBooks = async (data) => {
  let filter = {}
  if (data._id || data.title || data.author || data.price || data.stockQuantity) {
    filter.$and = []
  }
  if (data._id) {
    filter.$and.push({ _id: data._id })
  }
  if (data.title) {
    filter.$and.push({ title: data.title })
  }
  if (data.author) {
    filter.$and.push({ author: data.author })
  }
  if (data.price) {
    filter.$and.push({ price: data.price })
  }
  if (data.stockQuantity) {
    filter.$and.push({ user: data.stockQuantity })
  }
  logger.info('Finding all books by filter:', filter)
  let books = await Book.find({ filter })
  //logger.info('Books in service:', JSON.stringify(books))
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
  let book = await Book.create(newObject)
  logger.debug("Created successfully the Book: ", JSON.stringify(book))
  return book
}

exports.updateBook = async ({ bookId, data }) => {
  logger.info(`bookId= ${bookId} , data=${JSON.stringify(data)}`)
  let book = await Book.findById(bookId)
  if (data.title) {
    book.title = data.title
  }
  if (data.author) {
    book.author = data.author
  }
  if (data.price) {
    book.price = data.price
  }
  if (data.stockQuantity) {
    book.stockQuantity = data.stockQuantity
  }
  return await book.save()
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
