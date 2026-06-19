import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <span className="brand-mark">
          <span className="brand-dot" />
          Pulse
        </span>

        {user && (
          <div className="navbar-user">
            <Avatar username={user.username} size="sm" />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.username}</span>
            <button
              onClick={handleLogout}
              className="composer-attach-btn"
              style={{ marginLeft: 6 }}
              title="Log out"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
