import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

export const ChatContext =
  createContext(null);

const ChatContextProvider = ({
  children,
}) => {
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [typingUser, setTypingUser] =
    useState(null);

  const [replyingTo, setReplyingTo] =
    useState(null);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const selectUser = useCallback(
    (user) => {
      setSelectedUser(user);
      setMessages([]);
      setReplyingTo(null);
    },
    []
  );

  const setChatMessages =
    useCallback((newMessages) => {
      setMessages(
        Array.isArray(newMessages)
          ? newMessages
          : []
      );
    }, []);

  const addMessage = useCallback(
    (message) => {
      if (!message) {
        return;
      }

      setMessages(
        (previous) => [
          ...previous,
          message,
        ]
      );
    },
    []
  );

  const updateMessage =
    useCallback(
      (
        messageId,
        updatedMessage
      ) => {
        setMessages(
          (previous) =>
            previous.map(
              (message) => {
                const id =
                  message?._id ||
                  message?.id;

                return String(id) ===
                  String(
                    messageId
                  )
                  ? {
                      ...message,
                      ...updatedMessage,
                    }
                  : message;
              }
            )
        );
      },
      []
    );

  const removeMessage =
    useCallback(
      (messageId) => {
        setMessages(
          (previous) =>
            previous.filter(
              (message) => {
                const id =
                  message?._id ||
                  message?.id;

                return (
                  String(id) !==
                  String(
                    messageId
                  )
                );
              }
            )
        );
      },
      []
    );

  const setTyping = useCallback(
    (user) => {
      setTypingUser(user);
    },
    []
  );

  const clearTyping =
    useCallback(() => {
      setTypingUser(null);
    }, []);

  const startReply = useCallback(
    (message) => {
      setReplyingTo(message);
    },
    []
  );

  const cancelReply =
    useCallback(() => {
      setReplyingTo(null);
    }, []);

  const updateOnlineUsers =
    useCallback((users) => {
      setOnlineUsers(
        Array.isArray(users)
          ? users
          : []
      );
    }, []);

  const clearChat =
    useCallback(() => {
      setSelectedUser(null);
      setMessages([]);
      setTypingUser(null);
      setReplyingTo(null);
    }, []);

  const value = useMemo(
    () => ({
      selectedUser,
      messages,
      loading,
      typingUser,
      replyingTo,
      onlineUsers,

      setLoading,

      selectUser,
      setChatMessages,
      addMessage,
      updateMessage,
      removeMessage,

      setTyping,
      clearTyping,

      startReply,
      cancelReply,

      updateOnlineUsers,
      clearChat,
    }),
    [
      selectedUser,
      messages,
      loading,
      typingUser,
      replyingTo,
      onlineUsers,
      selectUser,
      setChatMessages,
      addMessage,
      updateMessage,
      removeMessage,
      setTyping,
      clearTyping,
      startReply,
      cancelReply,
      updateOnlineUsers,
      clearChat,
    ]
  );

  return (
    <ChatContext.Provider
      value={value}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;