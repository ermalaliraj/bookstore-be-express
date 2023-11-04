const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// private endpoints for users
router.get('/books', bookController.getAllBooks)
router.get('/books/:id', bookController.getBookById)
router.post('/books', bookController.createBook)
router.put('/books/:id', bookController.updateBook)
router.delete('/books/:id', bookController.deleteBookById)

module.exports = router;