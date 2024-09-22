/**
 * Author: Angelica Gutierrez
 * Date: 22 September 2024
 * File Name: app.spec.js
 * Description: In-N-Out Books Tests
 */

const request = require('supertest');
const app = require('../src/app');

// Create a test suite named “Chapter [Number]: API Tests”
describe('Chapter 3: API Tests', () => {
  // Should return all books.
  it('should return an array of books', async () => {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

  // Should return a single book using ID.
  it('should return a single book', async () => {
    const res = await request(app).get('/api/books/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title", "The Fellowship of the Ring");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
  });

  // Should return error if the ID is invalid.
  it('should return a 400 error if the id is not a number', async () => {
    const res = await request(app).get('/api/books/abc');

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });
});

// Create a test suite named “Chapter [Number]: API Tests”
describe('Chapter 4: API Tests', () => {
  // Should return a 201-status code when adding a new book.
  it('should return a 201-status code when adding a new book', async () => {
    const res = await request(app).post('/api/books').send({
      id: 99,
      title: "Dying Inside",
      author: "Pete Wentz",
    });

    expect(res.statusCode).toEqual(201);
  });

  // Should return a 400-status code when adding a new book with missing title.
  it('should return a 400-status code when adding a new book with missing title', async () => {
    const res = await request(app).post("/api/books").send({
      id: 100,
      author: "Pete Wentz",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Should return a 204-status code when deleting a book.
  it('should return a 204-status code when deleting a book', async () => {
    const res = await request(app).delete("/api/books/99");

    expect(res.statusCode).toEqual(204);
  });
});

// Create a test suite named “Chapter [Number]: API Tests”
describe('Chapter 5 API Tests', () => {
  // Should update a book and return a 204-status code
  it("Should update a book and return a 204-status code", async () => {
    const res = await request(app).put("/api/books/1").send({
      title: "Dying Inside",
      author: "Pete Wentz",
    });

    expect(res.statusCode).toEqual(204);
  });

  // Should return a 400-status code when using a non-numeric id
  it('should return a 400-status code when using a non-numeric id.', async () => {
    const res = await request(app).put("/api/books/abc").send({
      title: "Dying Inside",
      author: "Pete Wentz",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  // Should return a 400-status code when updating a book with a missing title
  it('should return a 400-status code when updating a book with a missing title', async () => {
    const res = await request(app).put("/api/books/1").send({
      title: "Dying Inside",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

});
