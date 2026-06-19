import React from "react";
import Avatar from "./Avatar";

const CommentSection = ({
  comments,
  expanded,
  onToggleExpanded,
  commentText,
  onCommentTextChange,
  onSubmitComment,
  submitting,
}) => {
  // Collapsed view only shows the most recent comment, like most social feeds do
  const visibleComments = expanded ? comments : comments.slice(-1);
  const hiddenCount = comments.length - visibleComments.length;

  return (
    <div className="comments-section">
      {hiddenCount > 0 && (
        <button className="view-comments-toggle" onClick={onToggleExpanded}>
          View {hiddenCount} earlier comment{hiddenCount > 1 ? "s" : ""}
        </button>
      )}

      {visibleComments.map((comment) => (
        <div className="comment-row" key={comment._id}>
          <Avatar username={comment.username} size="sm" />
          <div className="comment-bubble">
            <span className="comment-author">{comment.username}</span>
            {comment.text}
          </div>
        </div>
      ))}

      <form
        className="comment-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitComment();
        }}
      >
        <input
          className="comment-input"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          maxLength={500}
        />
        <button
          type="submit"
          className="comment-send-btn"
          disabled={submitting || !commentText.trim()}
          aria-label="Send comment"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
