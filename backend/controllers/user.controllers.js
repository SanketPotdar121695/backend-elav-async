const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/db');
const { UserModel } = require('../models/user.model');

const userRegister = async (req, res) => {
  try {
    let newUser = req.body;
    let userExists = await UserModel.find({ email: newUser.email });

    if (userExists.length) {
      return res.status(400).send({
        error:
          'A user already exists with the same email. Please try again with a different email address.',
      });
    } else {
      if (newUser.password.length >= 8) {
        bcrypt.hash(newUser.password, 5, async (err, hash) => {
          try {
            let user = new UserModel({ ...newUser, password: hash });
            await user.save();

            return res.status(200).send({
              message: 'Hurray, you are registered successfully!',
            });
          } catch (err) {
            return res.status(400).send({ error: err.message });
          }
        });
      } else
        return res.status(400).send({
          error:
            'Wrong credentials provided! The password length must be at least 8 characters long.',
        });
    }
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await UserModel.find({ email });

    if (user.length) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          jwt.sign(
            { userID: user[0]._id },
            secretKey,
            { expiresIn: '1h' },
            async (err, token) => {
              try {
                return res.status(200).send({
                  message: 'Hurray, You are logged in successfully!',
                  token,
                });
              } catch (err) {
                return res.status(400).send({ error: err.message });
              }
            }
          );
        } else
          return res
            .status(400)
            .send({ error: 'Login failed! Password is incorrect.' });
      });
    } else
      return res.status(400).send({ error: 'Wrong credentials provided!' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports = { userRegister, userLogin };
