import React, { useState } from "react";

const ReactionPicker = ({
  onSelect,
  selectedReaction = "",
  reactions = [
    "❤️",
    "😂",
    "👍",
    "😮",
    "😢",
    "😡",
    "👏",
    "🔥",
  ],
}) => {
  const [open, setOpen] =
    useState(false);

  const handleSelect = (emoji) => {
    onSelect?.(emoji);
    setOpen(false);
  };

  return (
    <div className="reaction-picker">
      <button
        type="button"
        className="reaction-picker-trigger"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        aria-label="Add reaction"
        title="Add reaction"
      >
        {selectedReaction || "😊"}
      </button>

      {open && (
        <div className="reaction-picker-menu">
          {reactions.map(
            (emoji) => (
              <button
                key={emoji}
                type="button"
                className={`reaction-option ${
                  selectedReaction ===
                  emoji
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleSelect(
                    emoji
                  )
                }
                aria-label={`React ${emoji}`}
              >
                {emoji}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;