import React from "react";

import MessageBubble from "./MessageBubble";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const MessageList = ({
  messages = [],
  currentUser,
  loading = false,
  onReply,
  onEdit,
  onDelete,
  onReaction,
}) => {
  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {
    return (
      <div className="message-list-loading">
        <Loader
          text="Loading messages..."
        />
      </div>
    );
  }

  /*
  ==========================================
  EMPTY
  ==========================================
  */

  if (!messages.length) {
    return (
      <div className="message-list-empty">
        <EmptyState
          icon="👋"
          title="No messages yet"
          message="Send a message to start the conversation."
        />
      </div>
    );
  }

  /*
  ==========================================
  CURRENT USER ID
  ==========================================
  */

  const currentUserId =
    currentUser?._id ||
    currentUser?.id;

  /*
  ==========================================
  MESSAGE LIST
  ==========================================
  */

  return (
    <div className="message-list">
      {messages.map(
        (message, index) => {

          const messageId =
            message?._id ||
            message?.id ||
            `message-${index}`;

          /*
          ==================================
          GET SENDER ID
          ==================================
          */

          const senderId =
            message?.sender?._id ||
            message?.sender?.id ||
            message?.senderId ||
            message?.user?._id ||
            message?.user?.id;

          /*
          ==================================
          CHECK OWN MESSAGE
          ==================================
          */

          let isOwnMessage =
            String(senderId) ===
            String(currentUserId);

          /*
          ==================================
          CHATKARO AI USER QUESTION
          ==================================

          AI mode me user ka question
          hum locally create kar rahe hain.

          aiUserMessage = true
          hone par message ko user
          ka message maana jayega.
          ==================================
          */

          if (
            message?.aiUserMessage ===
            true
          ) {
            isOwnMessage = true;
          }

          /*
          ==================================
          RENDER MESSAGE
          ==================================
          */

          return (
            <MessageBubble
              key={messageId}
              message={message}
              currentUser={
                currentUser
              }
              isOwnMessage={
                isOwnMessage
              }
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReaction={
                onReaction
              }
            />
          );
        }
      )}
    </div>
  );
};

export default MessageList;