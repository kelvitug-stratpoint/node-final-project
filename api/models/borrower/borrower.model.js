const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_id: { type: String, required: true },
  title: { type: String, required: true },
  borrowed_at: { type: Date, required: true }
});

const borrowerSchema = new mongoose.Schema({
  id: { type: String },
  fullname: {
    type: String,
    required: [true, 'Full Name is required']
  },
  max_books: { type: Number, default: 5 },
  books: bookSchema,
});

module.exports = mongoose.model('Borrower', borrowerSchema);