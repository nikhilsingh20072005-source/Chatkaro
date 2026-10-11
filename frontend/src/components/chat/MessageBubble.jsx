
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MessageActions from "./MessageActions";
import { getAvatarUrl } from "../../utils/avatar";

const MessageBubble = ({
  message,
  currentUser,
  isOwnMessage = false,
  onReply,
  onEdit,
  onDelete,
  onReaction,
}) => {
  const [showAvatar, setShowAvatar] = useState(false);

  if (!message) return null;

  const content = message.content || message.text || "";

  const sender = message.sender || message.user || {};

  const senderName =
    sender.username || sender.name || "User";

  const senderAvatarPath =
    sender.avatar || sender.profilePicture || "";

  const senderAvatar = getAvatarUrl(senderAvatarPath);

  const isAIMessage =
    message.aiGenerated === true ||
    sender?._id === "chatkaro-ai" ||
    sender?.id === "chatkaro-ai";

  const isAIUserMessage = message.aiUserMessage === true;

  const createdAt = message.createdAt || message.timestamp;

  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const messageType = message.type || "text";

  const currentUserId = currentUser?._id || currentUser?.id;

  const readBy = Array.isArray(message.readBy)
    ? message.readBy
    : [];

  const isRead = readBy.some((item) => {
    const readerId =
      item?.user?._id ||
      item?.user ||
      item?.id;

    return (
      String(readerId) !== String(currentUserId) &&
      Boolean(item?.readAt)
    );
  });

  const reactions = Array.isArray(message.reactions)
    ? message.reactions
    : [];

  const file = message.file || message.media || null;

  const fileUrl = file?.url || "";

  const fileName =
    file?.originalName ||
    file?.originalname ||
    file?.filename ||
    file?.name ||
    "Download file";

  const mimeType = file?.mimeType || file?.mimetype || "";

  const isImage =
    messageType === "image" ||
    mimeType.startsWith("image/");

  const isVideo =
    messageType === "video" ||
    mimeType.startsWith("video/");

  const isAudio =
    messageType === "audio" ||
    messageType === "voice" ||
    mimeType.startsWith("audio/");

  const getFullFileUrl = (url) => {
    if (!url) return "";

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return `http://localhost:5000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const fullFileUrl = getFullFileUrl(fileUrl);

  const closeAvatar = () => setShowAvatar(false);

  return (
    <>
      <div
        className={`message-wrapper ${
          isOwnMessage
            ? "message-wrapper-own"
            : "message-wrapper-other"
        } ${isAIMessage ? "message-wrapper-ai" : ""} ${
          isAIUserMessage ? "message-wrapper-ai-user" : ""
        }`}
      >
        {/* SENDER DP */}
        {!isOwnMessage && (
          <button
            type="button"
            className="message-sender-avatar message-sender-avatar-clickable"
            onClick={() => !isAIMessage && setShowAvatar(true)}
            aria-label={`View ${senderName}'s profile picture`}
            title={isAIMessage ? "ChatKaro AI" : `View ${senderName}'s DP`}
            disabled={isAIMessage}
          >
            {isAIMessage ? (
              <span className="ai-message-avatar">🤖</span>
            ) : senderAvatar ? (
              <img
                src={senderAvatar}
                alt={senderName}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{senderName.charAt(0).toUpperCase()}</span>
            )}
          </button>
        )}

        <div
          className={`message-content-wrapper ${
            isOwnMessage ? "own" : "other"
          }`}
        >
          {!isOwnMessage && (
            <span
              className={`message-sender-name ${
                isAIMessage ? "ai-sender-name" : ""
              }`}
            >
              {isAIMessage ? "🤖 ChatKaro AI" : senderName}
            </span>
          )}

          <div
            className={`message-bubble ${
              isOwnMessage
                ? "message-bubble-own"
                : "message-bubble-other"
            } ${isAIMessage ? "message-bubble-ai" : ""}`}
          >
            {message.replyTo && (
              <div className="message-reply-preview">
                <strong>
                  {message.replyTo.sender?.username || "Message"}
                </strong>
                <span>{message.replyTo.content || ""}</span>
              </div>
            )}

            {isImage && fullFileUrl && (
              <div className="message-media-preview">
                <img
                  src={fullFileUrl}
                  alt={fileName}
                  className="message-image"
                  onClick={() => window.open(fullFileUrl, "_blank")}
                />
                <a
                  href={fullFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="message-file-download"
                >
                  📥 Open / Download
                </a>
              </div>
            )}

            {isVideo && fullFileUrl && (
              <div className="message-video-preview">
                <video
                  src={fullFileUrl}
                  controls
                  className="message-video"
                />
                <a
                  href={fullFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="message-file-download"
                >
                  📥 Download video
                </a>
              </div>
            )}

            {isAudio && fullFileUrl && (
              <div className="message-audio-preview">
                <div>🎵 {fileName}</div>
                <audio src={fullFileUrl} controls />
                <a
                  href={fullFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="message-file-download"
                >
                  📥 Download audio
                </a>
              </div>
            )}

            {!isImage && !isVideo && !isAudio && fullFileUrl && (
              <div className="message-file-card">
                <div className="message-file-icon">📎</div>
                <div className="message-file-info">
                  <strong>{fileName}</strong>
                  <span>{mimeType || "File"}</span>
                </div>
                <a
                  href={fullFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="message-file-download"
                >
                  Open
                </a>
              </div>
            )}

            {content && !isImage && !isVideo && !isAudio && !fullFileUrl && (
              isAIMessage ? (
                <div className="message-text ai-markdown">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="message-text">{content}</p>
              )
            )}

            {isAIMessage && !message.aiError && (
              <div className="ai-model-info">
                🤖 Ollama
                {message.aiModel ? ` • ${message.aiModel}` : ""}
              </div>
            )}

            <div className="message-meta">
              <span>{time}</span>

              {isOwnMessage && (
                <span
                  className={isRead ? "message-read" : "message-sent"}
                >
                  {isRead ? "✓✓" : "✓"}
                </span>
              )}

              {message.edited && <span>edited</span>}
            </div>

            {reactions.length > 0 && (
              <div className="message-reactions">
                {reactions.map((reaction, index) => (
                  <button
                    key={`${reaction.user}-${index}`}
                    type="button"
                    className="message-reaction"
                    onClick={() =>
                      onReaction?.(
                        message._id || message.id,
                        reaction.emoji
                      )
                    }
                  >
                    {reaction.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isAIMessage && (
            <MessageActions
              message={message}
              isOwnMessage={isOwnMessage}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReaction={onReaction}
            />
          )}
        </div>
      </div>

      {/* ENLARGED SENDER DP */}
      {showAvatar && !isAIMessage && (
        <div
          className="avatar-modal-overlay"
          onClick={closeAvatar}
          role="presentation"
        >
          <div
            className="avatar-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${senderName}'s profile picture`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="avatar-modal-close"
              onClick={closeAvatar}
              aria-label="Close profile picture"
            >
              ×
            </button>

            {senderAvatar ? (
              <img
                src={senderAvatar}
                alt={senderName}
                className="avatar-modal-image"
              />
            ) : (
              <div className="avatar-modal-default">
                {senderName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="avatar-modal-info">
              <h2>{senderName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
