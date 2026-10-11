import React from "react";

const Avatar = ({
  src = "",
  name = "User",
  size = "medium",
  online = false,
  className = "",
}) => {
  const getInitial = () => {
    if (!name) {
      return "U";
    }

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const sizeClass =
    size === "small"
      ? "avatar-small"
      : size === "large"
      ? "avatar-large"
      : "avatar-medium";

  return (
    <div
      className={`avatar-wrapper ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={`avatar ${sizeClass}`}
        />
      ) : (
        <div
          className={`avatar avatar-default ${sizeClass}`}
          aria-label={name}
        >
          {getInitial()}
        </div>
      )}

      {online && (
        <span
          className="avatar-online"
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;