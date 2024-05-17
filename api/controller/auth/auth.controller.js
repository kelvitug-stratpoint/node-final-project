const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../../models/user/user.model');
const Borrower = require('../../models/borrower/borrower.model');

const privateKey = fs.readFileSync(path.join(__dirname, '../../../keys/private.key'), 'utf8');

exports.register = async (req, res) => {
  const { id, username, password, fullname } = req.body;
  try {

    const user = await User.create({ username, password });
    await Borrower.create({
      id: user.id,
      fullname
    })
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message:  error  });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOneAndUpdate({ username }, { last_Login: new Date() })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { userId: user.id };
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};