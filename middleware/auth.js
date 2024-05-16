const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     console.log(`${Date.now()} : ${req.path}`)
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
next();
};

module.exports = auth;