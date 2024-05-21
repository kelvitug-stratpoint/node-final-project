const Book = require('../../models/book/book.model')
const Borrower = require('../../models/borrower/borrower.model')

// Implement borrowing and returning books
exports.borrowBook = async (req, res) => {
  try {
    const { id } = req.params; // Book ID
    const userId = req.userId; // Borrower ID

    // Find the book by ID
    const borrower = await Borrower.findOne({ id: userId });
    const book = await Book.findOne({ id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is available for borrowing
    if (book.item_count === 0) {
      return res.status(400).json({ message: 'You have reached your maximum book stocks' });
    }

    if (borrower.max_books === 0) {
      return res.status(400).json({ message: 'You have reached your maximum borrowing limit' });
    }

    // Create the book entry for the borrower's books array
    const borrowedBook = {
      book_id: id,
      title: book.title,
      borrowed_at: new Date(),
    };

    // check if doesn't have existing borrower
    if (!borrower) {
      return res.status(400).json({ message: 'No existing Borrower' });
    }

    const existingBorrowerBook = borrower.books.find((book) => book.book_id === id);

    // check if has Existing Borrower Book
    if (existingBorrowerBook) {
      return res.status(400).json({ message: 'Existing Borrower Book found' });
    }

    // Decrement the book's item count
    await book.updateOne({ $inc: { item_count: -1 } });

    // Update the borrower's books array and decrement max_books atomically
    await Borrower.updateOne(
      { id: userId },
      {
        $inc: { max_books: -1 },
        $push: { books: borrowedBook }
      }
    );

    // Respond with success message
    res.status(200).json({ message: 'Book successfully borrowed!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const userId = req.userId;
    const { book_id } = req.params;

    // Check if the book exists
    const book = await Book.findOne({ id: book_id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the borrower exists and has the book
    const borrower = await Borrower.findOne(
      { id: userId, 'books.book_id': book_id },
      { 'books.$': 1 }
    );
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found or book not borrowed by this user' });
    }

    // Update the borrower's books array and increment max_books automatically
    const updateResult = await Borrower.updateOne(
      { id: userId },
      {
        $inc: { max_books: 1 },
        $pull: { books: { book_id: book_id } }
      }
    );

    if (updateResult.nModified === 0) {
      return res.status(400).json({ message: 'Failed to return the book' });
    }

    // Increment the book's item count
    await Book.updateOne({ id: book_id }, { $inc: { item_count: 1 } });

    res.status(200).json({ message: 'Book successfully returned!' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getBorrowedBooks = async (req, res) => {
  try {
    const userId = req.userId;
    const borrowers = await Borrower.find({ id: userId });
    if (!borrowers) {
      return res.status(404).json({ message: 'Borrowers not found' });
    }
    res.status(200).json(borrowers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};