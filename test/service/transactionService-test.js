const expect = require('chai').expect
const mongoose = require('mongoose')
const transactionService = require('../../src/service/transactionService')
const Book = require('../../src/models/book')
const Transaction = require('../../src/models/transaction')
const logger = require('../../src/utils/logger')

describe('Transaction Service', function () {
    let book1
    before(async function () {
        logger.debug("Before : Connecting to db")
        await mongoose.connect('mongodb+srv://devx:kr45Fz8gFNp8vEPg@dev.mioms8o.mongodb.net/bookstore')  // better to bring this to a util file 
        logger.debug("Connected to db")
        await Book.deleteMany()
        await Transaction.deleteMany()
    })
  
    after(async function () {
      await mongoose.disconnect()
    })
  
    beforeEach(async function () {
        book1 = new Book({
            title: "Crime and Punishment",
            author: "Fëdor Dostoevskij",
            price: 11.12,
            stockQuantity: 20
        })
        book1 = await book1.save()
    })

    afterEach(async function () {
        await Book.deleteMany()
        await Transaction.deleteMany()
    })
  
    it('When buy a book should decrease correctly the stockQuantity of the book and insert a new transaction record ', async function () {
        const data = {
            bookId: book1._id,
            quantity: 2
        }
        const book = await transactionService.buyBook(data)
        const dbBook = await Book.findById(book._id)
        const transactions = await Transaction.find({ bookId: book1._id })
        expect(dbBook.stockQuantity).to.be.equal(18)
        expect(transactions.length).to.be.equal(1)
    })

    it('When buy a book, should throw an error if is requested a grater quantity than the actual quantity of the book', async function () {
        try {
            const data = {
                bookId: book1._id,
                quantity: 50
            }
            await transactionService.buyBook(data)
        } catch (err) {
            expect(err).to.be.an('error')
            expect(err.message).to.equal('Not enough stock to fulfill the request!')
        }
    })

    it('When buy a book, should throw an error if the requested book does not exist', async function () {
        try {
            const data = {
                bookId: '6548cbd041060f24dd0e27f6',
                quantity: 1
            }
            await transactionService.buyBook(data)
        } catch (err) {
            expect(err).to.be.an('error')
            expect(err.message).to.equal('Book not found!')
        }
    })
})

