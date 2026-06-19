import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(form);
    if (success) navigate("/");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span className="brand-mark">
            <span className="brand-dot" />
            Pulse
          </span>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8, fontSize: "0.9rem" }}>
            Create an account to start posting
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="comment-input"
            style={{ width: "100%", marginBottom: 14, borderRadius: 10 }}
            value={form.username}
            onChange={handleChange}
            minLength={3}
            maxLength={30}
            required
          />

          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="comment-input"
            style={{ width: "100%", marginBottom: 14, borderRadius: 10 }}
            value={form.email}
            onChange={handleChange}
            required
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="comment-input"
            style={{ width: "100%", marginBottom: 18, borderRadius: 10 }}
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary-pulse" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
