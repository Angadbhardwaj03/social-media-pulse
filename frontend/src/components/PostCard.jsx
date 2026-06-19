import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";
import { formatRelativeTime } from "../utils/formatRelativeTime";

// Resolve relative image paths returned by the backend (e.g. "/uploads/x.jpg")
// into a full URL pointing at the API server.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const resolveImageUrl = (path) => (path?.startsWith("http") ? path : `${API_URL}${path}`);

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const hasLiked = likes.some((like) => like.user === user?.id || like.user?._id === user?.id);

  const handleToggleLike = async () => {
    if (likeSubmitting) return;
    setLikeSubmitting(true);

    // Optimistic update so the UI feels instant, then reconcile with the server response
    const wasLiked = hasLiked;
    setLikes((prev) =>
      wasLiked
        ? prev.filter((like) => like.user !== user.id)
        : [...prev, { user: user.id, username: user.username }]
    );

    try {
      const { data } = await api.post(`/api/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      // Roll back on failure
      setLikes((prev) =>
        wasLiked ? [...prev, { user: user.id, username: user.username }] : prev.filter((l) => l.user !== user.id)
      );
    } finally {
      setLikeSubmitting(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const { data } = await api.post(`/api/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });
      setComments(data.comments);
      setCommentText("");
      setCommentsExpanded(true);
    } catch (err) {
      // Silently ignored here; could surface a toast in a future iteration
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <article className="post-card">
      <div className="post-card-header">
        <Avatar username={post.username} size="md" />
        <div>
          <div className="post-author">{post.username}</div>
          <div className="post-timestamp">{formatRelativeTime(post.createdAt)}</div>
        </div>
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.image && (
        <div className="post-image-wrap">
          <img src={resolveImageUrl(post.image)} alt="Post attachment" loading="lazy" />
        </div>
      )}

      <div className="post-stats-row">
        <span>{likes.length} like{likes.length !== 1 ? "s" : ""}</span>
        <span>{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="post-actions-row">
        <button
          className={`post-action-btn ${hasLiked ? "liked" : ""}`}
          onClick={handleToggleLike}
        >
          <span className="heart-icon">{hasLiked ? "❤️" : "🤍"}</span>
          {hasLiked ? "Liked" : "Like"}
        </button>
        <button
          className="post-action-btn"
          onClick={() => setCommentsExpanded((prev) => !prev)}
        >
          💬 Comment
        </button>
      </div>

      <CommentSection
        comments={comments}
        expanded={commentsExpanded}
        onToggleExpanded={() => setCommentsExpanded(true)}
        commentText={commentText}
        onCommentTextChange={setCommentText}
        onSubmitComment={handleSubmitComment}
        submitting={commentSubmitting}
      />
    </article>
  );
};

export default PostCard;
