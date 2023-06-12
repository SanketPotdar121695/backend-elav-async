const { PostModel } = require('../models/post.model');

const createPost = async (req, res) => {
  try {
    let post = new PostModel(req.body);
    await post.save();

    return res
      .status(200)
      .send({ message: 'A new post has been added to the DB.' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    let posts = await PostModel.find({ userID: req.body.userID });
    return res.status(200).send({ posts });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    let post =
      (await PostModel.findOne({
        _id: req.params.postID,
        userID: req.body.userID
      })) || null;

    if (post) {
      await PostModel.updateOne({ _id: req.params.postID }, req.body);
      return res.status(200).send({
        message: `The post with ID:${req.params.postID} has been updated successfully!`
      });
    }
    return res.status(400).send({ error: "This post doesn't exist anymore!" });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    let post =
      (await PostModel.findOne({
        _id: req.params.postID,
        userID: req.body.userID
      })) || null;

    if (post) {
      await PostModel.deleteOne({ _id: req.params.postID });
      return res.status(200).send({
        message: `The post with ID:${req.params.postID} has been deleted successfully!`
      });
    }
    return res.status(400).send({ error: "This post doesn't exist anymore!" });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost };
