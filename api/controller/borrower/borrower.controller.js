const Book = require('../../models/book/book.model');
const Borrower = require('../../models/borrower/borrower.model')


// Implement borrowing and returning books
exports.borrowBook = async (req, res) => {
  try {
    const { id } = req.params; // Book ID
    const userId = req.userId; // Borrower ID

    // Find the book by ID
    const book = await Book.findOne({ id });
    const borrower = await Borrower.findOne({ id: userId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is available for borrowing
    if (book.item_count === 0) {
      return res.status(400).json({ message: 'You have reached your maximum book stocks' });
    }
    
    if(borrower.max_books === 0){
      return res.status(400).json({ message: 'You have reached your maximum borrowing limit' });
    }

    // Create the book entry for the borrower's books array
    const borrowedBook = {
      book_id: id,
      title: book.title,
      borrowed_at: new Date(),
    };

    // Update the book's item count
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
  } catch (error) {
    
  }
};

exports.getBorrowedBooks = async (req, res) => {
  try {
    const userId = req.userId;
    const borrowers = await Borrower.find({ id: userId });

    if(!borrowers){
      return res.status(404).json({ message: 'Borrowers not found' });
    }
    res.status(200).json(borrowers);
  } catch (error) {
    
  }
};