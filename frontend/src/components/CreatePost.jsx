import React, { useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim() && !imageFile) {
      setError("Write something or attach an image before posting.");
      return;
    }

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (imageFile) formData.append("image", imageFile);

    setSubmitting(true);
    try {
      const { data } = await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPostCreated(data);
      setText("");
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't publish your post. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="composer-card" onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: 10 }}>
        <Avatar username={user?.username} size="md" />
        <textarea
          className="composer-input"
          placeholder={`What's on your mind, ${user?.username}?`}
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
        />
      </div>

      {imagePreview && (
        <div className="composer-preview">
          <img src={imagePreview} alt="Selected attachment preview" />
          <button
            type="button"
            className="composer-remove-img"
            onClick={removeImage}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="composer-actions">
        <button
          type="button"
          className="composer-attach-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📷 Add photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
        <button type="submit" className="btn-primary-pulse" disabled={submitting}>
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default CreatePost;
