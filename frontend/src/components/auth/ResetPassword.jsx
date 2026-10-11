import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../../services/auth";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        "Invalid or missing reset token."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError(
        "Please fill all fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await resetPassword(
          token,
          password
        );

      setMessage(
        response?.message ||
          response?.data?.message ||
          "Password reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>
          Reset Password 🔐
        </h2>

        <p>
          Create a new password for
          your ChatKaro account.
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
          <label htmlFor="new-password">
            New Password
          </label>

          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter new password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">
            Confirm Password
          </label>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
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

export default ResetPassword;