import React from "react";

const TypingIndicator = ({
  username = "Someone",
}) => {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        {username
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="typing-content">
        <span className="typing-name">
          {username} is typing
        </span>

        <div className="typing-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;