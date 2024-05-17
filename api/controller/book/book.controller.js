const Book = require('../../models/book/book.model');


exports.createBook = async (req, res) => {
  try {
    const { title } = req.body;
    const duplicateBook = await Book.findOne({ title: title });

    if(duplicateBook){
      res.status(400).json({ message: 'Duplicate book found' });
    }
    const book = new Book(req.body);
    await book.save();

    await book.validate();
    res.json({
      message: 'Book successfully added!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ id: req.params.id, deleted_at: null }, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.validate();
    res.json({ message: 'Book successfully updated!'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ id: req.params.id }, { deleted_at: new Date() });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    console.log(req.userId);
    const books = await Book.find({ deleted_at: null });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id, deleted_at: null });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
