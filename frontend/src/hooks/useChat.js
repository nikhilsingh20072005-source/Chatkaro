import {
  useCallback,
  useContext,
} from "react";

import { ChatContext } from "../context/ChatContext";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../services/messages";

const useChat = () => {
  const context =
    useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatContextProvider"
    );
  }

  const {
    selectedUser,
    messages,
    loading,
    setLoading,
    setChatMessages,
    addMessage,
    removeMessage,
    selectUser,
  } = context;

  const loadMessages =
    useCallback(
      async (userId) => {
        if (!userId) {
          return;
        }

        try {
          setLoading(true);

          const response =
            await getMessages(
              userId
            );

          const data =
            response?.messages ||
            response?.data?.messages ||
            response?.data ||
            [];

          setChatMessages(
            Array.isArray(data)
              ? data
              : []
          );

          return data;
        } catch (error) {
          console.error(
            "LOAD MESSAGES ERROR:",
            error
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [
        setLoading,
        setChatMessages,
      ]
    );

  const sendChatMessage =
    useCallback(
      async ({
        receiverId,
        content,
        file,
      }) => {
        if (
          !receiverId ||
          (!content?.trim() &&
            !file)
        ) {
          return;
        }

        try {
          setLoading(true);

          const response =
            await sendMessage({
              receiverId,
              content:
                content?.trim() ||
                "",
              file,
            });

          const message =
            response?.message ||
            response?.data?.message ||
            response?.data ||
            null;

          if (message) {
            addMessage(message);
          }

          return message;
        } catch (error) {
          console.error(
            "SEND MESSAGE ERROR:",
            error
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [
        setLoading,
        addMessage,
      ]
    );

  const deleteChatMessage =
    useCallback(
      async (messageId) => {
        if (!messageId) {
          return;
        }

        try {
          await deleteMessage(
            messageId
          );

          removeMessage(
            messageId
          );
        } catch (error) {
          console.error(
            "DELETE MESSAGE ERROR:",
            error
          );

          throw error;
        }
      },
      [removeMessage]
    );

  return {
    selectedUser,
    messages,
    loading,

    selectUser,
    loadMessages,
    sendChatMessage,
    deleteChatMessage,
  };
};

export default useChat;