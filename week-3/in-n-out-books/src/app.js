/**
 * Author: Angelica Gutierrez
 * Date: 1 September 2024
 * File Name: app.js
 * Description: In-N-Out Books App
 */

// Setting up an Express application
const express = require("express");
const app = express(); // Creates an Express application

app.use(express.json()); // parse incoming requests as JSON payloads
app.use(express.urlencoded({ extended: true })); // parsing incoming urlencoded payloads
app.use(express.static('public'));

// GET route for the root URL (“/”)
app.get("/", async (req, res, next) => {
  // HTML content for the landing page
  const html =`
    <html>
      <head>
        <title>In-N-Out Books</title>
        <style>
          body, h1, h2, h3 {margin: 0; padding: 0; border: 0;}
          body {
            background: #424242;
          color: #zf;
          margin: 1.25rem;
          font-size: 1.25rem;
          }
          h1, h2, h3 {color: #EF5350; font-family: 'Emblema One', cursive;}
          h1, h2 {text - align: center }
          h3 {color: #zf; }
          .container {width: 50%; margin: 0 auto; font-family: 'Lora', serif; }
          .book {border: 1px solid #EF5350; padding: 1rem; margin: 1rem 0; }
          .book h3 {margin - top: 0; }
          main a {color: #zf; text-decoration: none; }
          main a:hover {color: #EF5350; text-decoration: underline;}
        </style>
      </head>

      <body>
        <div class="container">
          <header>
            <h1>In-N-Out Books</h1>
            34
            <h2>Discover New In-N-Out Books</h2>
          </header>
          <br />

          <main>
            <div class="book">
              <h3>In-N-Out Book 1</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>

            <div class="book">
              <h3>In-N-Out Book 2</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </main>

        </div>
      </body>
    </html>
    `; // end HTML content for the landing page
  res.send(html); // Sends the HTML content to the client
});

// GET route at /api/books that returns an array of books from the mock database.
// Use a try-catch block to handle any errors.
app.get('/api/books', async (req, res) => {
  try {
      const allBooks = await books.find();
      res.json(allBooks);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching books' });
  }
});

// A GET route at /api/books/:id that returns a single book with the matching id from the mock database.
// Use a try-catch block to handle any errors.
// Add error handling to check if the id is not a number and throwing a 400 error if it is not with an error message.
app.get('/api/books/:id', async (req, res) => {
  try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid book ID' });
      }
      const book = await books.findOne({ id });
      if (!book) {
          return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the book' });
  }
});

// Middleware functions
// 404 Error
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// 500 Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error', // return a JSON response with the error details
    error: process.env.NODE_ENV === 'development' ? err.stack : { } // error stack only if the application is running in development mode
  });
});

// Define the port number
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express application
module.exports = app;
