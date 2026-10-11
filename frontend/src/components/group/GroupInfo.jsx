import React from "react";
import { Link } from "react-router-dom";

const GroupInfo = ({
  group,
  onClose,
}) => {
  if (!group) {
    return null;
  }

  const groupName =
    group.name ||
    group.title ||
    "Group";

  const description =
    group.description ||
    "No group description.";

  const groupImage =
    group.avatar ||
    group.image ||
    group.profilePicture ||
    "";

  const members =
    group.members || [];

  const createdAt =
    group.createdAt;

  const createdDate = createdAt
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
    <div className="group-info">

      {/* Header */}

      <div className="group-info-header">
        <h2>
          Group Info
        </h2>

        {onClose && (
          <button
            type="button"
            className="group-info-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      {/* Group Profile */}

      <div className="group-info-profile">

        {groupImage ? (
          <img
            src={groupImage}
            alt={groupName}
            className="group-info-avatar"
          />
        ) : (
          <div className="group-info-avatar group-info-avatar-default">
            {groupName
              .charAt(0)
              .toUpperCase()}
          </div>
        )}

        <h1>
          {groupName}
        </h1>

        <p>
          {description}
        </p>

      </div>

      {/* Details */}

      <div className="group-info-details">

        <div className="group-info-row">
          <span>
            👥 Members
          </span>

          <strong>
            {members.length}
          </strong>
        </div>

        <div className="group-info-row">
          <span>
            📅 Created
          </span>

          <strong>
            {createdDate}
          </strong>
        </div>

      </div>

      {/* Actions */}

      <div className="group-info-actions">

        <Link
          to="/chat"
          className="group-info-chat-btn"
        >
          💬 Back to Chat
        </Link>

      </div>

    </div>
  );
};

export default GroupInfo;