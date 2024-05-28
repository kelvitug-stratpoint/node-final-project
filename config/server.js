const express = require('express');
const app = express();
const dotEnv = require('dotenv')
require('../config/mongodb');
dotEnv.config();

const PORT = process.env.PORT;

app.get("/", (req, res, next) => {
    res.send("Hello from Express!");
    next();
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});

module.exports = app;
