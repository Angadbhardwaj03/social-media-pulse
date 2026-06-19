const express = require("express");
const Post = require("../models/Post");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// @route   GET /api/posts?page=1&limit=10
// @desc    Get the public feed, newest posts first, paginated
// @access  Private (must be logged in to view the feed)
router.get("/", protect, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Fetch one extra document so we know whether another page exists,
    // without running a separate (slower) countDocuments query every time.
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean();

    const hasMore = posts.length > limit;
    const pagePosts = hasMore ? posts.slice(0, limit) : posts;

    res.json({
      posts: pagePosts,
      page,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load feed", error: error.message });
  }
});

// @route   POST /api/posts
// @desc    Create a post — text, image, or both (at least one is required)
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const hasText = text && text.trim().length > 0;
    const hasImage = !!req.file;

    if (!hasText && !hasImage) {
      return res.status(400).json({ message: "A post needs either text or an image" });
    }

    const post = await Post.create({
      user: req.user.id,
      username: req.user.username,
      text: hasText ? text.trim() : undefined,
      image: hasImage ? `/uploads/${req.file.filename}` : undefined,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle a like on a post for the logged-in user
// @access  Private
router.post("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLikeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    let liked;
    if (existingLikeIndex === -1) {
      post.likes.push({ user: req.user.id, username: req.user.username });
      liked = true;
    } else {
      post.likes.splice(existingLikeIndex, 1);
      liked = false;
    }

    await post.save();

    res.json({
      liked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update like", error: error.message });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user.id,
      username: req.user.username,
      text: text.trim(),
    };
    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      commentsCount: post.comments.length,
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
});

module.exports = router;
