
import React from "react";

const Signup = ({
  username,
  email,
  password,
  confirmPassword,
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  handleSignup,
  loading,
  message,
}) => {
  return (
    <div className="app">
      <div className="login-card">

        <div className="login-logo">
          C
        </div>

        <h1>ChatKaro</h1>

        <p className="subtitle">
          Create your ChatKaro account
        </p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <div className="signup-link">
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/login";
            }}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default Signup;
