import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import socketService from "../services/socket";

const useSocket = () => {
  const socketRef =
    useRef(null);

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    let mounted = true;

    const connectSocket =
      async () => {
        try {
          const socket =
            await socketService.connect();

          if (!mounted) {
            return;
          }

          socketRef.current =
            socket;

          setConnected(true);
          setError(null);
        } catch (err) {
          console.error(
            "SOCKET CONNECTION ERROR:",
            err
          );

          if (mounted) {
            setConnected(false);
            setError(err);
          }
        }
      };

    connectSocket();

    return () => {
      mounted = false;
    };
  }, []);

  const emit = useCallback(
    (
      event,
      data,
      callback
    ) => {
      const socket =
        socketRef.current;

      if (!socket) {
        return;
      }

      socket.emit(
        event,
        data,
        callback
      );
    },
    []
  );

  const on = useCallback(
    (event, handler) => {
      const socket =
        socketRef.current;

      if (!socket) {
        return () => {};
      }

      socket.on(
        event,
        handler
      );

      return () => {
        socket.off(
          event,
          handler
        );
      };
    },
    []
  );

  const off = useCallback(
    (event, handler) => {
      const socket =
        socketRef.current;

      if (!socket) {
        return;
      }

      socket.off(
        event,
        handler
      );
    },
    []
  );

  const disconnect =
    useCallback(() => {
      socketService.disconnect();

      socketRef.current =
        null;

      setConnected(false);
    }, []);

  return {
    socket:
      socketRef.current,
    connected,
    error,
    emit,
    on,
    off,
    disconnect,
  };
};

export default useSocket;