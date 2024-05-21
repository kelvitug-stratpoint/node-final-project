const express = require('express');
const router = express.Router();
const { register, login, createDummyUsers } = require('../controller/auth/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/generate-users', createDummyUsers);

module.exports = router;