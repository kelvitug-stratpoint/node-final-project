const { mongoose } = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: String, // String is shorthand for {type: String}
    author: String,
    publisher: String,
    description: String,
    isbn: Number,
    status: String,
    item_count: Number,
    deleted_at: String
  });

  const Book = mongoose.model('Book', bookSchema);

  module.exports = Book;