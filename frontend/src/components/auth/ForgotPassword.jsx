import React, { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../../services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await forgotPassword(
          email.trim()
        );

      setMessage(
        response?.message ||
          response?.data?.message ||
          "Password reset link has been sent to your email."
      );

      setEmail("");
    } catch (err) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>
          Forgot Password?
        </h2>

        <p>
          Enter your registered email
          to receive a password reset
          link.
        </p>
      </div>

      {message && (
        <div className="auth-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="auth-error">
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="forgot-email">
            Email Address
          </label>

          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-footer">
        <span>
          Remember your password?
        </span>

        <Link to="/login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;