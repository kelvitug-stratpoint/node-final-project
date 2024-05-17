const express = require('express');
const router = express.Router();
const { createBook, updateBook, deleteBook, getAllBooks, getBookById } = require('../controller/book/book.controller')
const { borrowBook } = require('../controller/borrower/borrower.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', auth, getAllBooks);
router.post('/', auth, createBook);
router.get('/:id',auth, getBookById);
router.put('/:id',auth, updateBook);
router.delete('/:id',auth, deleteBook);

router.put('/:id/borrow', auth, borrowBook);

module.exports = router;