
import React, { useState } from "react";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

import { getAvatarUrl } from "../../utils/avatar";

const ChatWindow = ({
  selectedUser,
  messages = [],
  currentUser,
  messageText = "",
  setMessageText,
  onSendMessage,
  onTyping,
  onStopTyping,
  typingUser,
  loading = false,

  // Message actions
  onReply,
  onEdit,
  onDelete,
  onReaction,

  // AI
  aiMode = false,
  onAskAI,
  aiLoading = false,

  // Group navigation
  groupView = "chat",
  onGroupViewChange,
}) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  const username =
    selectedUser?.username ||
    selectedUser?.name ||
    "User";

  const avatarPath =
    selectedUser?.avatar ||
    selectedUser?.profilePicture ||
    "";

  const avatar = getAvatarUrl(avatarPath);

  if (!selectedUser) {
    return (
      <div className="chat-window-empty">
        <div className="chat-window-empty-icon">💬</div>

        <h2>Welcome to ChatKaro</h2>

        <p>
          Select a conversation to start chatting.
        </p>
      </div>
    );
  }

  const groupFeatures = [
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "info", icon: "ℹ️", label: "Group Info" },
    { id: "members", icon: "👥", label: "Members" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const handleGroupViewChange = (view) => {
    onGroupViewChange?.(view);
    setShowGroupMenu(false);
  };

  return (
    <>
      <div
        className={`chat-window ${
          aiMode ? "chat-window-ai" : ""
        }`}
      >
        {/* CHAT HEADER */}
        <header className="chat-window-header">
          <div className="chat-window-user">
            {aiMode ? (
              <div className="chat-window-avatar chat-ai-window-avatar">
                🤖
              </div>
            ) : avatar ? (
              <img
                src={avatar}
                alt={username}
                className="chat-window-avatar chat-window-avatar-clickable"
                onClick={() => setShowAvatar(true)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div
                className="chat-window-avatar chat-window-avatar-default chat-window-avatar-clickable"
                onClick={() => setShowAvatar(true)}
              >
                {username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="chat-window-user-info">
              <h3>
                {aiMode ? "ChatKaro AI" : username}
              </h3>

              <span>
                {aiMode
                  ? "Powered by Ollama"
                  : typingUser
                  ? "typing..."
                  : "Online"}
              </span>
            </div>
          </div>

          {/* ALL HEADER ACTIONS STAY ON ONE LINE */}
          <div className="chat-window-actions">
            {aiMode && (
              <span className="ai-status">🤖 AI</span>
            )}

            {/* Search button */}
            <button
              type="button"
              aria-label="Search"
              title="Search messages"
            >
              🔍
            </button>

            {/* Group features: groups only */}
            {selectedUser?.isGroup && (
              <div className="chat-group-menu-wrapper">
                <button
                  type="button"
                  className="chat-group-menu-trigger"
                  aria-label="Group features"
                  title="Group features"
                  aria-expanded={showGroupMenu}
                  onClick={() =>
                    setShowGroupMenu((prev) => !prev)
                  }
                >
                  ☰
                </button>

                {showGroupMenu && (
                  <div className="group-header-dropdown">
                    {groupFeatures.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={
                          groupView === item.id ? "active" : ""
                        }
                        onClick={() =>
                          handleGroupViewChange(item.id)
                        }
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Existing more button */}
            <button
              type="button"
              aria-label="More"
              title="More options"
            >
              ⋮
            </button>
          </div>
        </header>

        {/* MESSAGE LIST */}
        <div className="chat-window-body">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            loading={loading}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onReaction={onReaction}
          />

          {typingUser && !aiMode && (
            <TypingIndicator
              username={typingUser?.username || username}
            />
          )}

          {aiMode && aiLoading && (
            <div className="ai-thinking">
              <div className="ai-thinking-avatar">
                🤖
              </div>

              <div className="ai-thinking-content">
                <div className="ai-thinking-name">
                  ChatKaro AI
                </div>

                <div className="ai-thinking-bubble">
                  <span>AI is thinking</span>

                  <span className="thinking-dots">
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MESSAGE INPUT */}
        <div className="chat-window-footer">
          <MessageInput
            value={messageText}
            onChange={setMessageText}
            onSend={onSendMessage}
            onTyping={onTyping}
            onStopTyping={onStopTyping}
            disabled={loading}
            aiMode={aiMode}
            onAskAI={onAskAI}
            placeholder={
              aiMode
                ? "Ask ChatKaro AI anything..."
                : "Type a message..."
            }
          />
        </div>
      </div>

      {/* LARGE AVATAR MODAL */}
      {showAvatar && !aiMode && (
        <div
          className="avatar-modal-overlay"
          onClick={() => setShowAvatar(false)}
        >
          <div
            className="avatar-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="avatar-modal-close"
              onClick={() => setShowAvatar(false)}
              aria-label="Close"
            >
              ×
            </button>

            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="avatar-modal-image"
              />
            ) : (
              <div className="avatar-modal-default">
                {username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="avatar-modal-info">
              <h2>{username}</h2>

              <p>
                {typingUser ? "typing..." : "Online"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
