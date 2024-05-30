const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
const bookCreate = require('../data/test/books-create.json')
const bookUpdate = require('../data/test/books-update.json')
const dotenv = require('dotenv');
const { connectDB, closeDB, clearDB } = require('../config/mongodb'); // Ensure to use the db connection file
dotenv.config();


const URL = process.env.URL;

const tempUser = {
  username: process.env.USER_TEST,
  password: process.env.USER_TEST_PASSWORD,
};


describe('books and borrowers API', () => {
  let token;
  let bookId;
  let invalidBookId = "book not found";
  let borrowBookId;

  before(async () => {
    await connectDB();
    
    await request(URL)
    .post('/auth/generate-users')

  const res = await request(URL)
    .post('/auth/login')
    .send(tempUser);

  token = await res.body.token;

  const response = await request(URL)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookCreate[1]);
      borrowBookId = await response.body.bookId;

  });

  after(async () => {
    await clearDB(); // Clear the database after each test
    await closeDB();
  });


  it('Should return successfully creating book', async () => {
    const response = await request(URL)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookCreate[0]);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully added!');
    bookId = await response.body.bookId;
  });

  it('Should return a 404 error when the book to be updated is not found', async () => {
    const response = await request(URL)
      .put(`/books/${invalidBookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(bookUpdate);
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message', 'Book not found');
  });

  it('Should return successfully updating the book', async () => {
    const response = await request(URL)
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(bookUpdate);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully updated!');
  });


  it('Should return a 404 error when the book to be retrieved is not found', async () => {
    const response = await request(URL)
      .get(`/books/${invalidBookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(bookUpdate);
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message', 'Book not found');
  });

  it('Should user can view borrowed books by id', async () => {
    const response = await request(URL)
      .get(`/borrowers`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('Should return error 400 when creating duplicate book', async () => {
    const response = await request(URL)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookCreate[0]);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message', 'Duplicate book found');
  });


  it('Should display all the lists of book created', async () => {
    const response = await request(URL)
      .get(`/books`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  // Start of Borrow flow 
  it('Should return a 404 error when the book to be borrowed is not found.', async () => {
    const response = await request(URL)
      .put(`/books/${invalidBookId}/borrow`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message', 'Book not found');
  });

  it('Should user can borrow books', async () => {
    const response = await request(URL)
      .put(`/books/${bookId}/borrow`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully borrowed!');
  });


  it('Should return a 400 error when the maximum book stock is reached.', async () => {
    const response = await request(URL)
      .put(`/books/${bookId}/borrow`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message', 'You have reached your maximum book stocks');
  });


  it('Should return a 400 error when the maximum borrowing limit is reached.', async () => {
    const response = await request(URL)
      .put(`/books/${borrowBookId}/borrow`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message', 'You have reached your maximum borrowing limit');
  });



  // End of Borrow flow 

  it('Should user can return books', async () => {
    const response = await request(URL)
      .post(`/borrowers/return-book/${bookId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully returned!');
  });

  it('Should return a 404 error when the book to be deleted is not found', async () => {
    const response = await request(URL)
      .delete(`/books/${invalidBookId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message', 'Book not found');
  });

  it('Should return sucessfully deleting a book', async () => {
    const response = await request(URL)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully deleted!');
  });

});
