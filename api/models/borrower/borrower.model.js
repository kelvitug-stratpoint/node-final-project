const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const borrowerSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  fullname: String,
  max_books: { type: Number, default: 5 },
  books: [
    {
      book_id: String,
      title: String,
      borrowed_at: Date,
    },
  ],
});

module.exports = mongoose.model('Borrower', borrowerSchema);