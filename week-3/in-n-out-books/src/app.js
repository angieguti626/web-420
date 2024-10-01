/**
 * Author: Angelica Gutierrez
 * Date: 6 October 2024
 * File Name: app.js
 * Description: In-N-Out Books App
 */

// Setting up an Express application
const express = require("express");
const app = express(); // Creates an Express application

const createError = require("http-errors");

const books = require("../database/books");
const bcrypt = require("bcryptjs");
const users = require("../database/users");


app.use(express.json()); // parse incoming requests as JSON payloads
app.use(express.urlencoded({ extended: true })); // parsing incoming urlencoded payloads
app.use(express.static('public'));

// Require statement for the ajv npm package
const Ajv = require("ajv");
const ajv = new Ajv();
const securityQuestionsSchema = {
  type: "object",
  properties: {
    newPassword: { type: "string" },
    securityQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          answer: { type: "string" },
        },
        required: ["answer"],
        additionalProperties: false,
      },
    },
  },
  required: ["securityQuestions"],
  additionalProperties: false,
};

// GET route for the root URL (“/”)
app.get("/", async (req, res, next) => {
  // HTML content for the landing page
  const html = `
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
    console.log("Book Titles: ", allBooks); // Logs all books
    res.send(allBooks); // Sends response with all books
  } catch (err) {
    console.error("Error: ", err.message); // Logs error message
    next(err); // Passes error to the next middleware
  }
});

// A GET route at /api/books/:id that returns a single book with the matching id from the mock database.
// Use a try-catch block to handle any errors.
// Add error handling to check if the id is not a number and throwing a 400 error if it is not with an error message.
app.get('/api/books/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    const book = await books.findOne({ id: id });
    console.log("Book: ", book);
    res.send(book);
  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

// A POST route at /api/books that adds a new book to the mock database and returns a 201-status code.
// Use a try-catch block to handle any errors (checking if the book title is missing and throwing a 400 error if it is)
// Include a message that is appropriate for the 400 error.
app.post("/api/books", async (req, res, next) => {
  try {
    const newBook = req.body;
    const expectedKeys = ["id", "title", "author"];
    const receivedKeys = Object.keys(newBook);

    if (!receivedKeys.every(key => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await books.insertOne(newBook);
    console.log("Result: ", result);
    res.status(201).send({ id: result.ops[0].id });
  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

// A DELETE route at /api/books/:id that deletes a book with the matching id from the mock database and returns a 204-status code.
// Use a try-catch block to handle any errors.
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await books.deleteOne({ id: parseInt(id) });
    console.log("Result: ", result);
    res.status(204).send();
  } catch (err) {
    if (err.message === "No matching item found") {
      return next(createError(404, "Book not found"));
    }
    console.error("Error: ", err.message);
    next(err);
  }
});

// A PUT route at /api/books/:id that updates a book with the matching id in the mock database and returns a 204-status code.
// Use a try-catch block to handle any errors.
app.put("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let book = req.body;
    id = parseInt(id);
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    const expectedKeys = ["title", "author"];
    const receivedKeys = Object.keys(book);
    if (
      !receivedKeys.every((key) => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length
    ) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }
    const result = await books.updateOne({ id: id }, book);
    console.log("Result: ", result);
    res.status(204).send();
  } catch (err) {
    if (err.message === "No matching book found") {
      console.log("Book not found", err.message);
      return next(createError(404, "Book not found"));
    }
    console.error("Error: ", err.message);
    next(err);
  }
});

// A POST route at /api/login that logs a user in and returns a 200-status code with ‘Authentication successful’ message.
// Use a try-catch block to handle any errors,
// Use the compareSync() method from the bcryptjs npm package to check if the password is valid. If not, throw 401 error
app.post("/api/login", async (req, res, next) => {
  try {
    const user = req.body;
    const expectedKeys = ["email", "password"];
    const receivedKeys = Object.keys(user);
    if (
      !receivedKeys.every((key) => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length
    ) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }
    let storedUser = await users.findOne({ email: user.email });
    let storedPassword = storedUser.password;
    if (bcrypt.compareSync(user.password, storedPassword) === false) {
      return next(createError(401, "Unauthorized"));
    }
    res.status(200).send({ message: "Authentication successful" });
  } catch (err) {
    console.error("Error: ", err);
    console.error("Error: ", err.message);
    next(err);
  }
});

// A POST route at /api/login that logs a user in and returns a 200-status code with ‘Authentication successful’ message.
// Use a try-catch block to handle any errors,
// Use the compareSync() method from the bcryptjs npm package to check if the password is valid. If not, throw 401 error
app.post("/api/login", async (req, res, next) => {
  try {
    const user = req.body;
    const expectedKeys = ["email", "password"];
    const receivedKeys = Object.keys(user);
    if (
      !receivedKeys.every((key) => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length
    ) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }
    let storedUser = await users.findOne({ email: user.email });
    let storedPassword = storedUser.password;
    if (bcrypt.compareSync(user.password, storedPassword) === false) {
      return next(createError(401, "Unauthorized"));
    }
    res.status(200).send({ message: "Authentication successful" });
  } catch (err) {
    console.error("Error: ", err);
    console.error("Error: ", err.message);
    next(err);
  }
});

// A POST route at /api/users/:email/verify-security-question that verifies security questions and returns 200 with ‘Security questions successfully answered’
// Use a try-catch block to handle any errors, including checking if the request body fails ajv validation and throwing a 400 error if it does with applicable message.
// If answers do not match the mock database, throw a 401 error with ‘Unauthorized’
app.post("/api/users/:email/verify-security-question", async (req, res, next) => {
  try {
    const { email } = req.params;
    const { securityQuestions } = req.body;
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(req.body);

    if (!valid) {
      console.error("Bad Request: Invalid request body", validate.errors);
      return next(createError(400, "Bad Request"));
    }
    const user = await users.findOne({ email: email });
    if (
      securityQuestions[0].answer !== user.securityQuestions[0].answer ||
      securityQuestions[1].answer !== user.securityQuestions[1].answer ||
      securityQuestions[2].answer !== user.securityQuestions[2].answer
    ) {
      console.error("Unauthorized");
      return next(createError(401, "Unauthorized"));
    }

    const result = await users.updateOne({ email: email }, { user });
    console.log("Result: ", result);
    res
      .status(200)
      .send({ message: "Security questions successfully answered", user: user });
  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

// Middleware functions
// 404 Error
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 500 handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
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
