import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) => {
  const classes = [
    "common-button",
    `button-${variant}`,
    `button-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="button-spinner" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;