
import React from "react";

const Login = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  loading,
  message,
  setMessage,
}) => {
  return (
    <div className="app">
      <div className="login-card">

        <div className="login-logo">
          C
        </div>

        <h1>ChatKaro</h1>

        <p className="subtitle">
          Connect. Chat. Stay Connected.
        </p>

        <form onSubmit={handleLogin}>

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

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <div className="signup-link">
          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/signup";
            }}
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
