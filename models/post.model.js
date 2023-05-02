const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: String,
    body: String,
    device: {
      type: String,
      enum: ['PC', 'TABLET', 'MOBILE'],
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const PostModel = mongoose.model('post', postSchema);

module.exports = { PostModel };
