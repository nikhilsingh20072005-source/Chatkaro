import React from "react";

const ReplyPreview = ({
  message,
  onCancel,
  onClick,
}) => {
  if (!message) {
    return null;
  }

  const sender =
    message.sender ||
    message.user ||
    {};

  const senderName =
    sender.username ||
    sender.name ||
    "User";

  const content =
    message.content ||
    message.text ||
    "Message";

  return (
    <div className="reply-preview">
      <div className="reply-preview-bar" />

      <div
        className="reply-preview-content"
        onClick={onClick}
        role={
          onClick
            ? "button"
            : undefined
        }
        tabIndex={
          onClick
            ? 0
            : undefined
        }
      >
        <span className="reply-preview-label">
          Replying to {senderName}
        </span>

        <span className="reply-preview-text">
          {content}
        </span>
      </div>

      {onCancel && (
        <button
          type="button"
          className="reply-preview-close"
          onClick={onCancel}
          aria-label="Cancel reply"
          title="Cancel reply"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ReplyPreview;