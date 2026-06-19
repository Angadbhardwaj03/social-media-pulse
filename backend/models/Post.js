const mongoose = require("mongoose");

// A single comment, embedded directly inside a post document
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // saved so the feed never needs a second query
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// One of the two required collections: every post, with its likes and comments embedded
const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // denormalized for fast feed rendering

    // Either text or image (or both) must be present — enforced in the route, not here,
    // so we can return a clear validation message to the client.
    text: { type: String, trim: true, maxlength: 2000 },
    image: { type: String }, // relative URL to the uploaded file, e.g. /uploads/169..jpg

    // Stores the usernames of everyone who liked the post, as required by the spec
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
      },
    ],

    comments: [commentSchema],
  },
  { timestamps: true }
);

// Feed reads are always sorted by newest first — this index makes that sort fast
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
