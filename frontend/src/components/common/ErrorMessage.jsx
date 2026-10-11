import React from "react";

const ErrorMessage = ({
  message,
  onClose,
  title = "Something went wrong",
  className = "",
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`error-message ${className}`}
      role="alert"
    >
      <div className="error-message-icon">
        !
      </div>

      <div className="error-message-content">
        {title && (
          <strong>{title}</strong>
        )}

        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          className="error-message-close"
          onClick={onClose}
          aria-label="Close error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;