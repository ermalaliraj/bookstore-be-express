const app = require('../../index') // implicitly run the server and connect to DB
const Transaction = require('../../src/models/transaction')
const Book = require('../../src/models/book')
var request = require('supertest')
const logger = require('../../src/utils/logger')
const { expect } = require('chai')

describe('IT -  Book endpoints', function () {
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

    it('GET /books with all filters(full match), should return only  1 record', async function () {
        let bookId = book._id
        let data = {
            title: "Crime and Punishment",
            author: "Fëdor Dostoevskij",
            price: 11.12,
            stockQuantity: 20,
            _id: bookId
        }

        queryParams = new URLSearchParams(data).toString()
        await request(app)
            .get('/books')
            .query(queryParams)
            .expect(200)
            .expect(function (response) {
                expect(response.body).to.be.an('array')
                expect(response.body).to.have.lengthOf(1)
                const book = response.body[0] // The returned book
                expect(book.title).to.equal(data.title)
                expect(book.author).to.equal(data.author)
                expect(book.price).to.equal(data.price.toString())
                expect(book.stockQuantity).to.equal(data.stockQuantity)
            })
    })

    it('GET /books/id', async function () {
        await request(app)
            .get('/books/' + book._id)
            .expect(200)
            .expect(function (response) {
                expect(response.body._id.toString()).to.equal(book._id.toString())
                expect(response.body.title).to.equal(book.title)
                expect(response.body.author).to.equal(book.author)
                expect(response.body.price).to.equal(book.price)
                expect(response.body.stockQuantity).to.equal(book.stockQuantity)
            })

    })

    it('When do GET /books/id throws an error if the id does not exist', async function () {
        let bookId = '64cc15dcf246d554688fceb4'
        await request(app)
            .delete('/books/' + bookId)
            .expect(400)
            .expect(function (response) {
                expect(response.body).to.have.property('errorCode')
                expect(response.body.errorCode).to.equal(1)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.equal("Could not find Book with id " + bookId)
            })
    })

    it('POST /books', async function () {
        const data = {
            title: 'Title',
            author: 'Author',
            price: 30.99,
            stockQuantity: 20
        }

        await request(app)
            .post('/books')
            .send(data)
            .expect(200)
            .expect(function (response) {
                expect(response.body._id.toString()).not.to.be.equal(null)
                expect(response.body.title).to.equal(data.title)
                expect(response.body.author).to.equal(data.author)
                expect(response.body.price).to.equal(data.price.toString())
                expect(response.body.stockQuantity).to.equal(data.stockQuantity)
            })

        await Book.deleteOne({ title: 'Title', author: 'Author', price: '30.99', stockQuantity: 20 })
    })

    it('PUT /books/id ', async function () {
        const bookId = book._id
        const updatedData = {
            title: 'Updated Title',
            author: 'Updated Author',
            price: 19.99,
            stockQuantity: 30
        }

        await request(app)
            .put('/books/' + bookId)
            .send(updatedData)
            .expect(200)
            .expect(function (response) {
                expect(response.body._id.toString()).to.equal(bookId.toString())
                expect(response.body.title).to.equal(updatedData.title)
                expect(response.body.author).to.equal(updatedData.author)
                expect(response.body.price).to.equal(updatedData.price.toString())
                expect(response.body.stockQuantity).to.equal(updatedData.stockQuantity)
            })
    })
  
    it('DELETE /books/id', async function () {
        await request(app)
            .delete('/books/' + book._id)
            .expect(201)
            .expect(function (response) {
                expect(response.body.deleted).to.equal(true)
            })

    })

})