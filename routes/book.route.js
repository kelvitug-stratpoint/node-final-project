const express = require('express');
const router = express.Router();
const { getBooks, createBook } = require('../controllers/book.controller')

router.get('/',getBooks);
router.post('/',createBook);


module.exports = router;