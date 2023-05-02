const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/db');
const { PostModel } = require('../models/post.model');

const requireAuth = async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    token = token.split(' ')[1];

    try {
      let { userID } = jwt.verify(token, secretKey);

      if (req.method === 'POST') {
        req.body = { ...req.body, authID: userID };
        next();
      } else {
        let { postID } = req.params;
        let post = await PostModel.findById(postID);

        if (post.authID === userID) next();
        else
          res.status(400).send({
            error: 'Access denied! You are not authorized to make changes.',
          });
      }
      next();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  } else
    return res
      .status(400)
      .send({ error: 'Access denied! You are not logged in.' });
};

module.exports = { requireAuth };
