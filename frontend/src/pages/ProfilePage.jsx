import React from "react";
import {
  Navigate,
  Link,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  /*
  ==============================================
  AUTH CHECK
  ==============================================
  */

  if (
    !loading &&
    !isAuthenticated
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
  ==============================================
  LOADING
  ==============================================
  */

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  /*
  ==============================================
  USER DATA
  ==============================================
  */

  const username =
    user?.username ||
    user?.name ||
    "User";

  const email =
    user?.email ||
    "No email available";

  const avatarPath =
    user?.avatar ||
    user?.profilePicture ||
    "";

    const avatar = 
      avatarPath
      ? avatarPath.startsWith("http")
      ? avatarPath
      : `http://localhost:5000${avatarPath}`
      : "";

  const bio =
    user?.bio ||
    "Hey! I'm using ChatKaro.";

  const joinedDate =
    user?.createdAt
      ? new Date(
          user.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : "Recently";

  /*
  ==============================================
  DEFAULT AVATAR
  ==============================================
  */

  const avatarLetter =
    username
      .charAt(0)
      .toUpperCase();

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <div className="profile-card">

          {/* COVER */}
          <div className="profile-cover">

            <div className="profile-avatar-wrapper">

              {avatar ? (
                <img
                  src={avatar}
                  alt={username}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar profile-avatar-default">
                  {avatarLetter}
                </div>
              )}

              {/* ONLINE DOT */}
              <span
                className="profile-online-dot"
                title="Online"
              />
            </div>

          </div>

          {/* ====================================
              PROFILE INFORMATION
          ==================================== */}

          <div className="profile-info">

            <h1>
              {username}
            </h1>

            <p className="profile-email">
              {email}
            </p>

            <p className="profile-bio">
              {bio}
            </p>

            {/* ==================================
                PROFILE META
            ================================== */}

            <div className="profile-meta">

              <span>
                📅 Joined{" "}
                {joinedDate}
              </span>

              {user?.phone && (
                <span>
                  📱 {user.phone}
                </span>
              )}

              {user?.location && (
                <span>
                  📍 {user.location}
                </span>
              )}

            </div>

            {/* ==================================
                ACTIONS
            ================================== */}

            <div className="profile-actions">

              <Link
                to="/settings"
                className="profile-edit-btn"
              >
                ✏️ Edit Profile
              </Link>

              <Link
                to="/chat"
                className="profile-chat-btn"
              >
                💬 Back to Chat
              </Link>

            </div>

          </div>

        </div>

        {/* ======================================
            PROFILE DETAILS
        ====================================== */}

        <div className="profile-details">

          {/* ACCOUNT INFORMATION */}

          <div className="profile-detail-card">

            <h2>
              Account Information
            </h2>

            <div className="profile-detail-row">

              <span>
                Username
              </span>

              <strong>
                {username}
              </strong>

            </div>

            <div className="profile-detail-row">

              <span>
                Email
              </span>

              <strong>
                {email}
              </strong>

            </div>

            <div className="profile-detail-row">

              <span>
                Account Status
              </span>

              <strong className="status-active">
                ● Active
              </strong>

            </div>

          </div>

          {/* CHATKARO */}

          <div className="profile-detail-card">

            <h2>
              ChatKaro
            </h2>

            <div className="profile-stats">

              <div className="profile-stat">

                <strong>
                  💬
                </strong>

                <span>
                  Messages
                </span>

              </div>

              <div className="profile-stat">

                <strong>
                  👥
                </strong>

                <span>
                  Friends
                </span>

              </div>

              <div className="profile-stat">

                <strong>
                  🟢
                </strong>

                <span>
                  Online
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;