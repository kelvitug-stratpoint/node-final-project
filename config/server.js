const express = require('express');
const app = express();
const dotEnv = require('dotenv')
dotEnv.config();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res, next) => {
    res.send("Hello from Express!");
    next();
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});

module.exports = app;
