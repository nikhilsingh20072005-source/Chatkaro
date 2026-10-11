import React from "react";

const Notification = ({
  notification,
  onClick,
  onClose,
  onMarkAsRead,
}) => {
  if (!notification) {
    return null;
  }

  const title =
    notification.title ||
    "Notification";

  const message =
    notification.message ||
    notification.content ||
    "";

  const type =
    notification.type ||
    "info";

  const isRead =
    notification.read ||
    notification.isRead;

  const createdAt =
    notification.createdAt ||
    notification.timestamp;

  const time = createdAt
    ? new Date(
        createdAt
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleClick = () => {
    onClick?.(notification);

    if (!isRead) {
      onMarkAsRead?.(
        notification._id ||
          notification.id
      );
    }
  };

  return (
    <div
      className={`notification ${
        isRead
          ? "notification-read"
          : "notification-unread"
      } notification-${type}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleClick();
        }
      }}
    >
      <div className="notification-icon">
        {type === "message"
          ? "💬"
          : type === "success"
          ? "✅"
          : type === "warning"
          ? "⚠️"
          : type === "error"
          ? "❌"
          : "🔔"}
      </div>

      <div className="notification-content">
        <div className="notification-top">
          <strong>
            {title}
          </strong>

          {time && (
            <span>
              {time}
            </span>
          )}
        </div>

        <p>
          {message}
        </p>
      </div>

      {!isRead && (
        <span
          className="notification-dot"
          aria-label="Unread"
        />
      )}

      {onClose && (
        <button
          type="button"
          className="notification-close"
          onClick={(event) => {
            event.stopPropagation();
            onClose(notification);
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;