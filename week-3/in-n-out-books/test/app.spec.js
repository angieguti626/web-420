/**
 * Author: Angelica Gutierrez
 * Date: 8 September 2024
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
    });

    // Should return a single book using ID.
    it('should return a single book', async () => {
        const res = await request(app).get('/api/books/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("id", 1);
    });

    // Should return error if the ID is invalid.
    it('should return a 400 error if the id is not a number', async () => {
        const res = await request(app).get('/api/books/abc');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid book ID');
    });
});
