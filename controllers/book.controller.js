
const Book = require('../models/book/book');

const getBooks = async (req, res) => {
    const books = await Book.find();
    console.log(books);
    res.json(books);
}

const createBook = async (req, res) => {
    const book = await Book.create({

    });
}
module.exports = {
    getBooks,
    createBook
}