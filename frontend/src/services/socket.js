import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

let socket = null;

const connect = () => {
  if (socket?.connected) {
    return Promise.resolve(socket);
  }

  return new Promise(
    (resolve, reject) => {
      const token =
        localStorage.getItem(
          "chatkaro_token"
        );

      socket = io(
        SOCKET_URL,
        {
          transports: [
            "websocket",
            "polling",
          ],

          auth: {
            token:
              token || "",
          },

          autoConnect: true,
        }
      );

      socket.once(
        "connect",
        () => {
          console.log(
            "Socket connected:",
            socket.id
          );

          resolve(socket);
        }
      );

      socket.once(
        "connect_error",
        (error) => {
          console.error(
            "Socket connection error:",
            error
          );

          reject(error);
        }
      );
    }
  );
};

const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const getSocket = () => {
  return socket;
};

const emit = (
  event,
  data,
  callback
) => {
  if (!socket) {
    return;
  }

  socket.emit(
    event,
    data,
    callback
  );
};

const on = (
  event,
  callback
) => {
  if (!socket) {
    return;
  }

  socket.on(
    event,
    callback
  );
};

const off = (
  event,
  callback
) => {
  if (!socket) {
    return;
  }

  socket.off(
    event,
    callback
  );
};

const socketService = {
  connect,
  disconnect,
  getSocket,
  emit,
  on,
  off,
};

export default socketService;