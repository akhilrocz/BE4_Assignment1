const { initializeDatabase } = require("./db/db.connect");

const Book = require("./models/books.models");
const express = require("express");

const cors = require("cors");
initializeDatabase();

const app = express();

app.use(cors());

app.use(express.json());

// const book = {
//   title: "Lean In",
//   author: "Sheryl Sandberg",
//   publishedYear: 2012,
//   genre: ["Non-fiction", "Business"],
//   language: "English",
//   country: "United States",
//   rating: 4.1,
//   summary:
//     "A book about empowering women in the workplace and achieving leadership roles.",
//   coverImageUrl: "https://example.com/lean_in.jpg",
// };

const book = {
  title: "Shoe Dog",
  author: "Phil Knight",
  publishedYear: 2016,
  genre: ["Autobiography", "Business"],
  language: "English",
  country: "United States",
  rating: 4.5,
  summary:
    "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
  coverImageUrl: "https://example.com/shoe_dog.jpg",
};

app.get("/", (req, res) => {
  res.send("hello express");
});

app.post("/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.send(savedBook);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error creating book." });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the books" });
  }
});

app.get("/books/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const book = await Book.findOne({ title: title });
    if (!book) {
      return res.status(404).send({ error: "Book not found." });
    }
    res.status(200).send(book);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the book" });
  }
});

app.get("/books/author/:authorName", async (req, res) => {
  const authorName = req.params.authorName;
  try {
    const books = await Book.find({ author: authorName });
    if (books.length === 0) {
      return res.status(404).send({ error: "No books found for this author." });
    }
    res.status(200).send(books);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the books" });
  }
});

app.get("/books/genre/:genreName", async (req, res) => {
  const genreName = req.params.genreName;
  try {
    const books = await Book.find({ genre: genreName });
    if (books.length === 0) {
      return res.status(404).send({ error: "No books found for this genre." });
    }
    res.status(200).send(books);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the books" });
  }
});

app.get("/books/publishedYear/:releasedYear", async (req, res) => {
  const releasedYear = req.params.releasedYear;
  try {
    const books = await Book.find({ publishedYear: releasedYear });
    if (books.length === 0) {
      return res
        .status(404)
        .send({ error: "No books found for this released year." });
    }
    res.status(200).send(books);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the books" });
  }
});

app.put("/books/:id/rating", async (req, res) => {
  const id = req.params.id;
  const { rating } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { $set: { rating } },
      { new: true }
    );
    if (!book) {
      return res.status(404).send({ error: "Book does not exist." });
    }
    res.status(200).send({ message: "Rating updated successfully.", book });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while updating the rating" });
  }
});

app.put("/books/:title", async (req, res) => {
  const title = req.params.title;
  const updatedData = req.body;
  try {
    const book = await Book.findOneAndUpdate({ title: title }, updatedData, {
      new: true,
    });
    if (!book) {
      return res.status(404).send({ error: "Book does not exist." });
    }
    res
      .status(200)
      .send({ message: "Book details updated successfully.", book: book });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while updating the book details" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }
    res.status(200).send({ message: "Book deleted successfully", book: book });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while deleting the book" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});
