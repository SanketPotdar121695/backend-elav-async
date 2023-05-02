const { PostModel } = require('../models/post.model');

const createPost = async (req, res) => {
  try {
    let newPost = new PostModel(req.body);
    await newPost.save();

    return res
      .status(200)
      .send({ message: 'New post has been added to the DB.' });
  } catch (err) {
    return res.status(400).send({ error: err, message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { device } = req.query;

    if (device) {
      let posts = await PostModel.find({ authID: req.body.authID, device });
      return res.status(200).send(posts);
    } else {
      let posts = await PostModel.find({ authID: req.body.authID });
      return res.status(200).send(posts);
    }
  } catch (err) {
    return res.status(400).send({ error: err, message });
  }
};

const updatePost = async (req, res) => {
  try {
    let { postID } = req.params;
    let updates = req.body;

    await PostModel.findByIdAndUpdate(postID, updates);
    return res.status(200).send({
      message: `The post with ID:${postID} has been updated successfully.`,
    });
  } catch (err) {
    return res.status(400).send({ error: err, message });
  }
};

const deletePost = async (req, res) => {
  try {
    let { postID } = req.params;

    await PostModel.findByIdAndDelete(postID);
    return res.status(200).send({
      message: `The post with ID:${postID} has been deleted successfully.`,
    });
  } catch (err) {
    return res.status(400).send({ error: err, message });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost };
