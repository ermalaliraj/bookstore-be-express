const expect = require('chai').expect
const mongoose = require('mongoose')
const bookService = require('../../src/service/bookService')
const Book = require('../../src/models/book')
const logger = require('../../src/utils/logger')

describe('Book Service', function () {
  let book1
  before(async function () {
    logger.debug("Before : Connecting to db")
    await mongoose.connect('mongodb+srv://devx:kr45Fz8gFNp8vEPg@dev.mioms8o.mongodb.net/bookstore')  // better to bring this to a util file 
    logger.debug("Connected to db")
    await Book.deleteMany()
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
  })
  
  it('When create new book Should insert correctly', async function () {
    //Given
    const bookData = {
      title: "Crime and Punishment - 2",
      author: "Fëdor Dostoevskij - 2",
      price: 11.12,
      stockQuantity: 20
    }
    //When
    const savedBook = await bookService.createBook(bookData)
    //Then
    const dbBook = await Book.findById(savedBook._id)
    expect(dbBook._id.toString()).not.to.be.equal(null)
    expect(dbBook.title).to.be.equal(bookData.title)
    expect(dbBook.author).to.be.equal(bookData.author)
    expect(dbBook.price).to.be.equal(bookData.price.toString())
    expect(dbBook.stockQuantity).to.be.equal(bookData.stockQuantity)
  })

  it('update book', async function () {
    const bookData = {
      stockQuantity: 20
    }
    const updateBook = await bookService.updateBook({ bookId: book1._id, data: bookData })
    const dbBook = await Book.findById(updateBook._id)
    expect(dbBook.stockQuantity).to.be.equal(bookData.stockQuantity)
  })

  it('When getBooks by ID Should return the correct list', async function () {
    //logger.debug("Starting test: filter by Id")
    let bookData = {
      _id: book1._id
    }
    const books = await bookService.getAllBooks(bookData)
    expect(books.length).to.be.equal(1)
  })

  it('When getBooks byTitle Should return correct list', async function () {
    // logger.debug("Starting test: filter by tittle")
    let bookData = {
      title: 'Crime and Punishment'
    }
    const books = await bookService.getAllBooks(bookData)
    expect(books.length).to.be.equal(1)
  })

  it('When getBooks byPrice Should return correct list', async function () {
    // logger.debug("Starting test: filter byPrice")
    let bookData = {
      price: 11.12
    }
    const books = await bookService.getAllBooks(bookData)
    expect(books.length).to.be.equal(1)
  })

  it('When getBooks byStockQuantity Should return correct list', async function () {
    // logger.debug("Starting test: filter byStockQuantity")
    let bookData = {
      stockQuantity: 20
    }
    const books = await bookService.getAllBooks(bookData)
    expect(books.length).to.be.equal(1)
  })


  it('When getUsers by ALL NULLS Should return full list', async function () {
    //logger.debug("Starting test: filter all null")
    let bookData = {}
    const books = await bookService.getAllBooks(bookData)
    expect(books.length).to.be.equal(1)
  })

  it('When getBooks by FULL match Should return 1 record', async function () {
    //logger.debug("Starting test : filter full match")
    const bookData = {
      _id: book1._id,
      title: "Crime and Punishment",
      author: "Fëdor Dostoevskij",
      price: 11.12,
      stockQuantity: 20
    }
    const books = await bookService.getAllBooks(bookData)
    expect(books.length).to.be.equal(1)
  })

  it('Should throw error when do getBookById for a non existing id', async function () {
    let bookId = '6548cb9d5a5111ab45310ce1'
    try {
      await bookService.getBookById(bookId)
    } catch (err) {
      expect(err).to.be.an('error')
      expect(err.message).to.equal("Could not find Book with id " + bookId)
    }
  })

  it('Should return correct book when do getBookById for a valid id', async function () {
    let bookId = book1._id
    const retrieveBook = await bookService.getBookById(bookId)
    expect(retrieveBook._id).to.eql(bookId)
  })

  it('Deletes correctly from db a book with a valid id', async function () {
    let bookId = book1._id
    const result = await bookService.deleteBookById(bookId)
    const deletedBook = await Book.findById(bookId)

    expect(result).to.be.true
    expect(deletedBook).to.be.null
  })

})

