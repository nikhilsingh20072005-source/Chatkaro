const {
  Server,
} = require("socket.io");

let io = null;

/*
==================================================
INITIALIZE SOCKET.IO
==================================================
*/

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
      ],
      credentials: true,
    },
  });

  /*
  ================================================
  CONNECTION
  ================================================
  */

  io.on("connection", (socket) => {
    console.log(
      "User connected:",
      socket.id
    );

    /*
    ==============================================
    USER ONLINE
    ==============================================
    */

    socket.on(
      "userOnline",
      (userId) => {
        if (!userId) return;

        socket.userId =
          String(userId);

        socket.join(
          `user:${userId}`
        );

        console.log(
          "User online:",
          userId
        );

        io.emit(
          "userOnline",
          String(userId)
        );
      }
    );

    /*
    ==============================================
    JOIN CONVERSATION
    ==============================================
    */

    socket.on(
      "joinConversation",
      (conversationId) => {
        if (!conversationId) {
          return;
        }

        const room =
          `conversation:${conversationId}`;

        socket.join(room);

        console.log(
          `Socket ${socket.id} joined ${room}`
        );
      }
    );

    /*
    ==============================================
    LEAVE CONVERSATION
    ==============================================
    */

    socket.on(
      "leaveConversation",
      (conversationId) => {
        if (!conversationId) {
          return;
        }

        const room =
          `conversation:${conversationId}`;

        socket.leave(room);

        console.log(
          `Socket ${socket.id} left ${room}`
        );
      }
    );

    /*
    ==============================================
    TYPING START
    ==============================================
    */

    socket.on(
      "typing",
      ({
        conversationId,
        userId,
      } = {}) => {
        if (!conversationId) {
          return;
        }

        socket
          .to(
            `conversation:${conversationId}`
          )
          .emit("typing", {
            conversationId,
            userId,
          });
      }
    );

    /*
    ==============================================
    TYPING STOP
    ==============================================
    */

    socket.on(
      "stopTyping",
      ({
        conversationId,
        userId,
      } = {}) => {
        if (!conversationId) {
          return;
        }

        socket
          .to(
            `conversation:${conversationId}`
          )
          .emit("stopTyping", {
            conversationId,
            userId,
          });
      }
    );

    /*
    ==============================================
    MESSAGE READ
    ==============================================
    */

    socket.on(
      "messageRead",
      ({
        messageId,
        userId,
        conversationId,
      } = {}) => {
        if (
          !messageId ||
          !userId ||
          !conversationId
        ) {
          return;
        }

        socket
          .to(
            `conversation:${conversationId}`
          )
          .emit("messageRead", {
            messageId,
            userId,
          });
      }
    );

    /*
    ==============================================
    DISCONNECT
    ==============================================
    */

    socket.on(
      "disconnect",
      () => {
        console.log(
          "User disconnected:",
          socket.id
        );

        if (socket.userId) {
          io.emit(
            "userOffline",
            socket.userId
          );

          console.log(
            "User offline:",
            socket.userId
          );
        }
      }
    );
  });

  return io;
}

/*
==================================================
GET SOCKET INSTANCE
==================================================
*/

function getIO() {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
}

module.exports = {
  initializeSocket,
  getIO,
};