const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config()
//routes

const bookRoute = require('./routes/book.route')

mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
    console.log('connected to database')
}).catch((error) => {
    console.log(error);
})




app.use((req, res, next) => {
    console.log(`Time: ${Date.now()} ${req.path}`);
    next();
})

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




