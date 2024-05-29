const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
const bookCreate = require('../data/test/books-create.json')
const bookUpdate = require('../data/test/books-update.json')
const dotenv = require('dotenv');
const { connectDB, closeDB, clearDB } = require('../config/mongodb'); // Ensure to use the db connection file
dotenv.config();


const URL = `${process.env.URL}:${process.env.PORT}`;

const tempUser = {
  username: process.env.USER_TEST,
  password: process.env.USER_TEST_PASSWORD,
};


describe('books and borrowers API', () => {
  let token;
  let bookId;

  before(async () => {
    await connectDB();
  });

  after(async () => {
    await clearDB(); // Clear the database after each test
  });


  beforeEach(async () => {
    await request(URL)
      .post('/auth/generate-users')

    const res = await request(URL)
      .post('/auth/login')
      .send(tempUser);

    token = await res.body.token;
  });

  after(async () => {
    await closeDB();
  });

  it('Should return successfully creating book', async () => {
    const response = await request(URL)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookCreate);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully added!');
    bookId = await response.body.bookId;
  });



  it('Should return successfully updating the book', async () => {
    const response = await request(URL)
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(bookUpdate);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully updated!');
  });


  it('Should return sucessfully deleting a book', async () => {
    const response = await request(URL)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully deleted!');
  });


  it('Should display all the lists of book created', async () => {
    const response = await request(URL)
      .get(`/books`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });


  it('Should user can borrow books', async () => {
    const response = await request(URL)
      .put(`/books/${bookId}/borrow`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully borrowed!');
  });
  

  it('Should user can return books', async () => {
    const response = await request(URL)
      .post(`/borrowers/return-book/${bookId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Book successfully returned!');
  });

  it('Should user can view borrowed books by id', async () => {
    const response = await request(URL)
      .get(`/borrowers`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });



});
