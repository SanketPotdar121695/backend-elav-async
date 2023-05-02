const { Router } = require('express');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require('../controllers/post.controllers');
const { requireAuth } = require('../middlewares/auth.middleware');

const postRouter = Router();

postRouter.use(requireAuth);

postRouter.get('/?device', getPosts);
postRouter.post('/create', createPost);
postRouter.patch('/update/:postID', updatePost);
postRouter.delete('/delete/:postID', deletePost);

module.exports = { postRouter };
