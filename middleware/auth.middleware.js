const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const publicKey = fs.readFileSync(path.join(__dirname, '../keys/public.key'), 'utf8');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) res.status(401).json({ message: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    console.log(`Date: ${Date.now() } URL: ${req.path} Method: ${req.method}`);
    req.userId = decoded.userId;
    console.log(`UserId: ${req.userId}`);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};