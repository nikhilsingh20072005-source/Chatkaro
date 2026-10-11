
import React, {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Signup from "../components/auth/Signup";

import {
  AuthContext,
} from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();

  const {
    signup,
    loading: authLoading,
  } = useContext(AuthContext);

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setMessage(
        "Please fill all fields"
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match"
      );
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await signup({
        username,
        email,
        password,
      });

      console.log(
        "SIGNUP RESPONSE:",
        response
      );

      const token =
        response?.token ||
        response?.data?.token;

      if (!token) {
        throw new Error(
          "Account created but token was not received"
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
        "SIGNUP ERROR:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed";

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
          <Signup
            username={username}
            email={email}
            password={password}
            confirmPassword={
              confirmPassword
            }
            setUsername={setUsername}
            setEmail={setEmail}
            setPassword={setPassword}
            setConfirmPassword={
              setConfirmPassword
            }
            handleSignup={
              handleSignup
            }
            loading={
              loading || authLoading
            }
            message={message}
          />
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
