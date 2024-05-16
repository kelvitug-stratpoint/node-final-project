const express = require('express');
const router = express.Router();
const { createBook, updateBook, deleteBook, getAllBooks, getBookById } = require('../controller/book/book.controller')
const { borrowBook, returnBook, getBorrowedBooks } = require('../controller/borrower/borrower.controller');
const auth = require('../../middleware/auth');

router.get('/', getAllBooks);
router.post('/', createBook);
router.get('/',auth, getBookById);
router.put('/:id',auth, updateBook);
router.delete('/:id',auth, deleteBook);

module.exports = router;