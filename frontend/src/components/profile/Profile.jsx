import React from "react";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Profile = ({
  user: userProp,
  showEditButton = true,
}) => {
  const auth = useAuth();

  const user =
    userProp || auth?.user;

  if (!user) {
    return (
      <div className="profile-empty">
        <p>
          User information not available.
        </p>
      </div>
    );
  }

  const username =
    user.username ||
    user.name ||
    "User";

  const email =
    user.email ||
    "No email available";

  const avatar =
    user.avatar ||
    user.profilePicture ||
    "";

  const bio =
    user.bio ||
    "Hey! I'm using ChatKaro.";

  const createdAt =
    user.createdAt;

  const joinedDate = createdAt
    ? new Date(
        createdAt
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "Recently";

  return (
    <div className="profile-component">

      <div className="profile-component-card">

        {/* Avatar */}

        <div className="profile-component-avatar-wrapper">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="profile-component-avatar"
            />
          ) : (
            <div className="profile-component-avatar profile-component-avatar-default">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <span className="profile-component-online" />
        </div>

        {/* Information */}

        <div className="profile-component-info">

          <h2>
            {username}
          </h2>

          <p className="profile-component-email">
            {email}
          </p>

          <p className="profile-component-bio">
            {bio}
          </p>

          <div className="profile-component-meta">

            <span>
              📅 Joined{" "}
              {joinedDate}
            </span>

            {user.location && (
              <span>
                📍 {user.location}
              </span>
            )}

          </div>

          {/* Actions */}

          {showEditButton && (
            <div className="profile-component-actions">

              <Link
                to="/settings"
                className="profile-component-edit"
              >
                ✏️ Edit Profile
              </Link>

              <Link
                to="/chat"
                className="profile-component-chat"
              >
                💬 Chat
              </Link>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;