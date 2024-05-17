const express = require('express');
const app = express();
const dotEnv = require('dotenv')
require('./config/mongodb');
dotEnv.config();
//routes

const bookRoute = require('./api/routes/book.route')
const borrowerRoute = require('./api/routes/borrower.route')
const authRoute = require('./api/routes/auth.route')


const PORT = process.env.PORT;

app.get("/", (req, res, next) => {
    res.send("Hello from Express!");
    next();
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});

//contacts
app.use(express.json());
app.use('/book', bookRoute)
app.use('/borrower',borrowerRoute)



// Public routes
app.use('/auth', authRoute)



