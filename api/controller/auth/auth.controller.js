const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../../models/user/user.model');
const Borrower = require('../../models/borrower/borrower.model');
const dummyUsers = require('../../../data/dummy/users.json');

const privateKey = fs.readFileSync(path.join(__dirname, '../../../keys/private.key'), 'utf8');

exports.register = async (req, res) => {
  const { id, username, password, fullname } = req.body;
  try {

    const user = await User.create({ username, password });
    await Borrower.create({
      id: user.id,
      fullname
    })
    res.status(200).json({ message: 'User registered successfully' });
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
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.createDummyUsers = async (req, res) => {
  try {
    // Iterate over the dummy users and save each one
    const userPromises = dummyUsers.map(async (user) => {
      const newUser = new User(user);
      await Borrower.create({
        id: newUser.id,
        fullname: user.fullname
      })

      return newUser.save();
    });

    // Wait for all promises to resolve
    const savedUsers = await Promise.all(userPromises);

    // Send the response with the saved users
    res.status(200).json(savedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};