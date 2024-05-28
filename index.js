const express = require('express');
const app = require('./config/server')
require('./config/mongodb');

//routes
const bookRoute = require('./api/routes/book.route')
const borrowerRoute = require('./api/routes/borrower.route')
const authRoute = require('./api/routes/auth.route')




//contacts
app.use(express.json());
app.use('/books', bookRoute)
app.use('/borrowers',borrowerRoute)



// Public routes
app.use('/auth', authRoute)



