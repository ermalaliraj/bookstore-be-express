const logger = require('../utils/logger')
const mongoose = require('mongoose')
const Transaction = require('../models/transaction')
const Book = require('../models/book')
const CouldNotFindBookError = require('../error/CouldNotFindBook')
const NotEnoughStockError = require('../error/NotEnoughStockError')

exports.buyBook = async (data) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const book = await Book.findById(data.bookId)
    if (!book) {
      throw new CouldNotFindBookError('Book not found!')
    }
    if (book.stockQuantity < data.quantity) {
      throw new NotEnoughStockError('Not enough stock to fulfill the request!')
    }
    book.stockQuantity = book.stockQuantity - data.quantity
    await book.save()

    const transaction = new Transaction({
      bookId: data.bookId,
      userId: 1, //fake user
      quantity: data.quantity,
      transactionDate: new Date()
    })
    await transaction.save()
    await session.commitTransaction()
    logger.info(`Sold ${data.quantity} pairs of book book '${book.title}'`)
    return book
  } catch (error) {
    session.abortTransaction()
    logger.error('An error occurred during the transaction: ' + error)
    throw error
  } finally {
    session.endSession()
  }
}
