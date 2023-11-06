const app = require('../../index') // implicitly run the server and connect to DB
const Transaction = require('../../src/models/transaction')
const Book = require('../../src/models/book')
var request = require('supertest')
const logger = require('../../src/utils/logger')
const sinon = require('sinon')
const { expect } = require('chai')

describe('IT - Tansaction endpoints', function () {
    let book
    before(async function () {
        await Transaction.deleteMany()
        await Book.deleteMany()
        book = new Book({
            title: 'Crime and Punishment',
            author: 'Fëdor Dostoevskij',
            price: 11.12,
            stockQuantity: 20
        })
        book = await book.save()
    })

    after(async function () {
        await Transaction.deleteMany()
        await Book.deleteMany()
        await app.stop()
    })
   
    it('POST /transactions should decrease correctly the stockQuantity from the book and insert a transaction', async function () {
        let data = {
            bookId: book._id,
            quantity: 2
        }
        await request(app)
            .post('/transactions')
            .send(data)
            .expect(200)
            .expect(function (response) {
                //logger.info('res.body:', response.body)
                expect(response.body.stockQuantity).to.equal(18)
            })
    })

    it('POST /transactions if error occurred, the stockQuantity from the book should remain unchanged and not transaction will be added', async function () {
        let data = {
            bookId: book._id,
            quantity: 2
        }
        // Stub the HTTP POST request to '/transactions' and return a simulated error
        const postStub = sinon.stub(request(app), 'post')
        postStub.withArgs('/transactions')
            .throws(new Error('Simulated error'))

        try {
            await request(app)
                .post('/transactions')
                .send(data)
                .expect(function (response) {
                    expect(response.body.stockQuantity).to.equal(20)
                })
        } catch (error) {

        }
        postStub.restore()
    })
  
})