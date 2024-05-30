const Book = require('../../models/book/book.model');
const dummyBooks = require('../../../data/dummy/books.json');


exports.createBook = async (req, res) => {
  try {
    const { title } = req.body;
    const duplicateBook = await Book.findOne({ title: title });

    if (duplicateBook) {
      return res.status(400).json({ message: 'Duplicate book found' });
    }
    const book = new Book(req.body);
    await book.save();

    await book.validate();
    return res.status(200).json({
      message: 'Book successfully added!',
      bookId: book.id
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ id: req.params.id, deleted_at: null }, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.validate();
    return res.json({ 
      message: 'Book successfully updated!',
      bookId: book.id
     });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ id: req.params.id }, { deleted_at: new Date() }, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.json({ message: 'Book successfully deleted!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ deleted_at: null });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id, deleted_at: null });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.json(book);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.createDummyBooks = async (req, res) => {
  try {
    await Book.insertMany(dummyBooks).then(function (docs) {
      return res.json(docs);
    }).catch(function (error) {
      return res.status(500).send(error);
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}