const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const bookSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4, unique: true
  },
  title: {
    type: String,
    required: [true, 'Book Title is required']
  },
  author: {
    type: String,
    required: [true, 'Book Author is required']
  },
  publisher: {
    type: String,
    required: [true, 'Book Publisher is required']
  },
  description: {
    type: String
  },
  isbn: {
    type: Number,
    required: [true, 'Book ISBN is required']
  },
  status: {
    type: String,
    default: 'Available'
  },
  item_count: {
    type: Number,
    required: [true, 'Item count is required']
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, { timestamps: true, id: false });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;