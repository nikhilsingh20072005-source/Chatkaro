import React from "react";

const Avatar = ({
  src = "",
  name = "User",
  size = "medium",
  online = false,
}) => {
  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const sizeClass =
    size === "small"
      ? "profile-avatar-small"
      : size === "large"
      ? "profile-avatar-large"
      : "profile-avatar-medium";

  return (
    <div className="profile-avatar-wrapper">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`profile-avatar ${sizeClass}`}
        />
      ) : (
        <div
          className={`profile-avatar profile-avatar-default ${sizeClass}`}
        >
          {initial}
        </div>
      )}

      {online && (
        <span
          className="profile-avatar-online"
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;