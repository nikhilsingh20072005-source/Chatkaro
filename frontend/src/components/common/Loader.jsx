import React from "react";

const Loader = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizeClass =
    size === "small"
      ? "loader-small"
      : size === "large"
      ? "loader-large"
      : "loader-medium";

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader ${sizeClass}`}>
          <span />
          <span />
          <span />
        </div>

        {text && (
          <p className="loader-text">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className={`loader ${sizeClass}`}>
        <span />
        <span />
        <span />
      </div>

      {text && (
        <p className="loader-text">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;