import React from "react";

// A small fixed palette — picked from our design tokens — so avatar colors
// stay on-brand instead of being fully random.
const PALETTE = ["#5B3DF5", "#FF6B5B", "#2ECC71", "#F5A623", "#19A7CE", "#E0488B"];

// Hashes the username into a stable index so the same person always gets
// the same avatar color across the whole feed.
const colorForName = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

const Avatar = ({ username, size = "md" }) => {
  const initial = username ? username.charAt(0) : "?";
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: colorForName(username) }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
};

export default Avatar;
