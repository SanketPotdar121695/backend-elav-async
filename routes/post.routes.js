const { Router } = require('express');
const { auth } = require('../middlewares/auth.middleware');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost
} = require('../controllers/post.controllers');

const postRouter = Router();

postRouter.post('/create', auth, createPost);
postRouter.get('/', auth, getPosts);
postRouter.patch('/update/:postID', auth, updatePost);
postRouter.delete('/delete/:postID', auth, deletePost);

module.exports = { postRouter };
