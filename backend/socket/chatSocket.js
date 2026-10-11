const { getIO } = require("./socket");

function setupChatSocket() {
  const io = getIO();

  /*
  ================================================
  SOCKET CONNECTION HANDLERS
  ================================================
  */

  io.on("connection", (socket) => {
    /*
    ==============================================
    SEND MESSAGE TO CONVERSATION
    ==============================================
    */

    socket.on(
      "sendMessage",
      (message) => {
        if (!message) return;

        const conversationId =
          message.conversationId ||
          message.conversation?._id;

        if (!conversationId) {
          return;
        }

        io.to(
          `conversation:${conversationId}`
        ).emit(
          "newMessage",
          message
        );
      }
    );

    /*
    ==============================================
    MESSAGE UPDATED
    ==============================================
    */

    socket.on(
      "messageUpdated",
      (message) => {
        if (!message) return;

        const conversationId =
          message.conversationId ||
          message.conversation?._id;

        if (!conversationId) {
          return;
        }

        io.to(
          `conversation:${conversationId}`
        ).emit(
          "messageUpdated",
          message
        );
      }
    );

    /*
    ==============================================
    MESSAGE DELETED
    ==============================================
    */

    socket.on(
      "messageDeleted",
      ({
        messageId,
        conversationId,
      } = {}) => {
        if (
          !messageId ||
          !conversationId
        ) {
          return;
        }

        io.to(
          `conversation:${conversationId}`
        ).emit(
          "messageDeleted",
          {
            messageId,
            conversationId,
          }
        );
      }
    );

    /*
    ==============================================
    REACTION ADDED
    ==============================================
    */

    socket.on(
      "reactionAdded",
      ({
        messageId,
        conversationId,
        reaction,
      } = {}) => {
        if (
          !messageId ||
          !conversationId
        ) {
          return;
        }

        io.to(
          `conversation:${conversationId}`
        ).emit(
          "reactionAdded",
          {
            messageId,
            reaction,
          }
        );
      }
    );

    /*
    ==============================================
    REACTION REMOVED
    ==============================================
    */

    socket.on(
      "reactionRemoved",
      ({
        messageId,
        conversationId,
        reaction,
      } = {}) => {
        if (
          !messageId ||
          !conversationId
        ) {
          return;
        }

        io.to(
          `conversation:${conversationId}`
        ).emit(
          "reactionRemoved",
          {
            messageId,
            reaction,
          }
        );
      }
    );
  });
}

module.exports =
  setupChatSocket;