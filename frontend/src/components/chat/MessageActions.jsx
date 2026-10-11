import React, { useState } from "react";

const REACTIONS = [
  "❤️",
  "😂",
  "👍",
  "😍",
  "😢",
  "😡",
  "😮",
  "👏",
  "🔥",
  "🎉",
];

const MessageActions = ({
  message,
  isOwnMessage = false,
  onReply,
  onEdit,
  onDelete,
  onReaction,
}) => {
  const [open, setOpen] = useState(false);

  if (!message) {
    return null;
  }

  const messageId =
    message._id || message.id;

  const handleReply = () => {
    setOpen(false);
    onReply?.(message);
  };

  const handleEdit = () => {
    setOpen(false);
    onEdit?.(message);
  };

  const handleDelete = () => {
    setOpen(false);
    onDelete?.(messageId);
  };

  const handleReaction = (emoji) => {
    console.log("REACTION CLICK:", {
      messageId,
      emoji,
    });

    setOpen(false);

    onReaction?.(
      messageId,
      emoji
    );
  };

  return (
    <div className="message-actions">

      {/* THREE DOT */}
      <button
        type="button"
        className="message-actions-trigger"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-label="Message actions"
        title="Message actions"
      >
        ⋮
      </button>

      {/* MENU */}
      {open && (
        <div
          className={`message-actions-menu ${
            isOwnMessage
              ? "menu-own"
              : "menu-other"
          }`}
        >
          {/* REPLY */}
          <button
            type="button"
            onClick={handleReply}
          >
            ↩️ Reply
          </button>

          {/* REACTIONS */}
          <div className="reaction-picker">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="reaction-picker-button"
                onClick={() =>
                  handleReaction(emoji)
                }
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* EDIT + DELETE */}
          {isOwnMessage && (
            <>
              <button
                type="button"
                onClick={handleEdit}
              >
                ✏️ Edit
              </button>

              <button
                type="button"
                className="danger-action"
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* QUICK REACTIONS */}
      <div className="message-quick-reactions">
        {REACTIONS.slice(0, 3).map(
          (emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() =>
                handleReaction(emoji)
              }
              aria-label={`React ${emoji}`}
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default MessageActions;