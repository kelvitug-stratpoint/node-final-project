const express = require('express');
const router = express.Router();
const { returnBook, getBorrowedBooks } = require('../controller/borrower/borrower.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', auth, getBorrowedBooks);
// router.post('/return', auth, createBook);


module.exports = router;