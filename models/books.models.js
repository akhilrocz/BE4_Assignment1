const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    publishedYear: Number,
    genre: { type: [String] },
    language: String,
    country: String,
    rating: Number,
    summary: String,
    coverImageUrl: String,
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", booksSchema);

module.exports = Book;
