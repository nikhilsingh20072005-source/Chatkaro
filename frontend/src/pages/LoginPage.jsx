
import React, {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Login from "../components/auth/Login";

import {
  AuthContext,
} from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    login,
    loading: authLoading,
  } = useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage(
        "Email and password are required"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      const token =
        response?.token ||
        response?.data?.token;

      if (!token) {
        throw new Error(
          "Login successful but token was not received"
        );
      }

      localStorage.setItem(
        "chatkaro_token",
        token
      );

      const user =
        response?.user ||
        response?.data?.user;

      if (user) {
        localStorage.setItem(
          "chatkaro_user",
          JSON.stringify(user)
        );
      }

      navigate("/chat");
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-container">

        <div className="auth-page-brand">
          <div className="auth-page-logo">
            C
          </div>

          <h1>ChatKaro</h1>

          <p>
            Connect. Chat. Stay Connected.
          </p>
        </div>

        <div className="auth-page-form">
          <Login
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
            loading={
              loading || authLoading
            }
            message={message}
            setMessage={setMessage}
          />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
