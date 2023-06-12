const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');
const { auth } = require('../middlewares/auth.middleware');
const { secretKey1, secretKey2 } = require('../config/db');
const { BlacklistModel } = require('../models/blacklist.model');

const signup = async (req, res) => {
  try {
    const newUser = req.body;
    const existingUser = await UserModel.find({ email: newUser.email });

    if (existingUser.length) {
      return res.status(400).send({
        error:
          'Registration failed! A user already exists with the email ID. Please try again with different email ID.'
      });
    }

    let hash = bcrypt.hashSync(newUser.password, 5);

    let user = new UserModel({ ...newUser, password: hash });
    await user.save();

    return res.status(200).send({ message: 'Registration successful!' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const newUser = req.body;
    const existingUser =
      (await UserModel.findOne({ email: newUser.email })) || null;

    if (!existingUser) {
      return res.status(400).send({
        error: 'Login failed! Wrong credentials provided. Please try again.'
      });
    }

    bcrypt.compare(newUser.password, existingUser.password, (error, result) => {
      if (result) {
        let token = jwt.sign({ userID: existingUser._id }, secretKey1, {
          expiresIn: '1h'
        });

        let rToken = jwt.sign({ userID: existingUser._id }, secretKey2, {
          expiresIn: '7d'
        });
        return res
          .status(200)
          .send({ message: 'Login successful!', token, rToken });
      }
      return res.status(400).send({
        error:
          'Login failed! Wrong password provided. Please check your password and try again.'
      });
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || null;
    console.log(token);

    if (token) {
      await BlacklistModel.updateMany({}, { $push: { blacklist: [token] } });
      return res.status(200).send('You are logged out successfully!');
    }

    return res
      .status(400)
      .send({ error: 'You are already logged out. Please login again.' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const regenerate = async (req, res) => {
  try {
    let rToken = req.headers.authorization?.split(' ')[1] || null;
    let decoded = jwt.verify(rToken, secretKey2);

    if (decoded) {
      let token = jwt.sign({ userID: decoded.userID }, secretKey1, {
        expiresIn: '1h'
      });
      return res
        .status(200)
        .send({ message: 'Regeneration successful!', token, rToken });
    }
    return res.status(400).send({ error: 'Regeneration failed!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { signup, login, logout, regenerate };
