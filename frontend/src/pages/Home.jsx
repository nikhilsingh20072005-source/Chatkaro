
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="home-logo">
          <div className="home-logo-circle">
            C
          </div>

          <span>ChatKaro</span>
        </div>

        <div className="home-nav-links">
          <Link to="/login">
            Login
          </Link>

          <Link
            to="/signup"
            className="home-signup-btn"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main className="home-hero">

        <div className="home-content">

          <div className="home-badge">
            💬 Welcome to ChatKaro
          </div>

          <h1>
            Connect.
            <br />
            <span>Chat.</span>
            <br />
            Stay Connected.
          </h1>

          <p>
            ChatKaro is a simple and modern
            chatting platform where you can
            connect with friends and enjoy
            real-time conversations.
          </p>

          <div className="home-buttons">

            <Link
              to="/signup"
              className="home-primary-btn"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="home-secondary-btn"
            >
              Login
            </Link>

          </div>

        </div>

        {/* CHAT PREVIEW */}
        <div className="home-chat-preview">

          <div className="preview-header">
            <div className="preview-user">
              <div className="preview-avatar">
                N
              </div>

              <div>
                <strong>
                  ChatKaro
                </strong>

                <small>
                  ● Online
                </small>
              </div>
            </div>
          </div>

          <div className="preview-messages">

            <div className="preview-message received">
              Hey! 👋
            </div>

            <div className="preview-message received">
              Welcome to ChatKaro!
            </div>

            <div className="preview-message sent">
              Hello! Nice to meet you 😊
            </div>

            <div className="preview-message sent">
              Let's start chatting!
            </div>

          </div>

          <div className="preview-input">
            <span>
              Type a message...
            </span>

            <button>
              ➤
            </button>
          </div>

        </div>

      </main>

      {/* FEATURES */}
      <section className="home-features">

        <div className="feature-card">
          <div className="feature-icon">
            💬
          </div>

          <h3>
            Real-time Chat
          </h3>

          <p>
            Send and receive messages
            instantly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            🔒
          </div>

          <h3>
            Secure
          </h3>

          <p>
            Your account and conversations
            are protected.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            👥
          </div>

          <h3>
            Connect
          </h3>

          <p>
            Find users and start conversations
            easily.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} ChatKaro.
          All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default Home;
