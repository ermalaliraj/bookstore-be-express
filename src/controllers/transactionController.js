const transactionService = require('../service/transactionService')
const DataBuilder = require('n-params-processor').DataBuilder
const logger = require('../utils/logger')

exports.buyBook = async (req, res, next) => {
  try {
    let dataBuilder = new DataBuilder({ source: req.body })
    dataBuilder.parseObjectId({ name: 'bookId', required: true })
    dataBuilder.parseInt({ name: 'quantity', required: true })
    let data = dataBuilder.build()
    const book = await transactionService.buyBook(data)
    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
}
