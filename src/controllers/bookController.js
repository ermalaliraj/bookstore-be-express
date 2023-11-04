const bookService = require('../service/bookService')
const DataBuilder = require('n-params-processor').DataBuilder
const logger = require('../utils/logger')

function _parseBookIdFromQuery(source = {}) {
  let dataBuilder = new DataBuilder({source})
  dataBuilder.parseObjectId({name: 'id', required: true})
  let data = dataBuilder.build()
  let bookId = data.id
  logger.info("bookId taken from param:", bookId)
  return bookId
}

exports.getAllBooks = async (req, res, next) => {
  try {
    logger.info("getAllBooks request.params:", JSON.stringify(req.query), "body:", JSON.stringify(req.body))
    let dataBuilder = new DataBuilder({source: req.query})
    dataBuilder.parseObjectId({name: 'id', required: false})
    dataBuilder.parseString({name: 'title', required: false})
    dataBuilder.parseString({name: 'author', required: false})
    dataBuilder.parseInt({name: 'price', required: false})
    dataBuilder.parseInt({name: 'stockQuantity', required: false})
    let data = dataBuilder.build()

    let book = await bookService.getAllBooks(data)
    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
}

exports.getBookById = async (req, res, next) => {
  try {
    const bookId = _parseBookIdFromQuery(req.params)
    let book = await bookService.getBookById(bookId)
    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
}

exports.createBook = async (req, res, next) => {
  try {
    let dataBuilder = new DataBuilder({source: req.body})
    dataBuilder.parseString({name: 'title', required: true})
    dataBuilder.parseString({name: 'author', required: true})
    dataBuilder.parseString({name: 'price', required: true})
    dataBuilder.parseInt({name: 'stockQuantity', required: true})
    let data = dataBuilder.build()
    const book = await bookService.createBook(data)
    // res.status(201) TODO for testing purpose return the inserted book
    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookId = _parseBookIdFromQuery(req.params)

    let dataBuilder = new DataBuilder({source: req.body})
    dataBuilder.parseString({name: 'title', required: true})
    dataBuilder.parseString({name: 'author', required: true})
    dataBuilder.parseString({name: 'price', required: true})
    dataBuilder.parseInt({name: 'stockQuantity', required: true})
    let data = dataBuilder.build()

    let book = await bookService.updateBook({bookId, data: data})
    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
}

exports.deleteBookById = async (req, res, next) => {
  try {
    const bookId = _parseBookIdFromQuery(req.params)
    let deletedRes = await bookService.deleteBookById(bookId)
    res.status(201).json({deleted: deletedRes})
  } catch (err) {
    next(err)
  }
}
