import api from "./api";

export const getMessages =
  async (userId) => {
    const response =
      await api.get(
        `/messages/${userId}`
      );

    return response.data;
  };

export const sendMessage =
  async ({
    receiverId,
    content = "",
    file = null,
    replyTo = null,
  }) => {
    const formData =
      new FormData();

    formData.append(
      "receiverId",
      receiverId
    );

    formData.append(
      "content",
      content
    );

    if (replyTo) {
      formData.append(
        "replyTo",
        replyTo
      );
    }

    if (file) {
      formData.append(
        "file",
        file
      );
    }

    const response =
      await api.post(
        "/messages",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const deleteMessage =
  async (messageId) => {
    const response =
      await api.delete(
        `/messages/${messageId}`
      );

    return response.data;
  };

export const editMessage =
  async (
    messageId,
    content
  ) => {
    const response =
      await api.put(
        `/messages/${messageId}`,
        { content }
      );

    return response.data;
  };

export const reactToMessage =
  async (
    messageId,
    reaction
  ) => {
    const response =
      await api.post(
        `/messages/${messageId}/reaction`,
        { reaction }
      );

    return response.data;
  };

export const searchMessages =
  async (
    userId,
    query
  ) => {
    const response =
      await api.get(
        `/messages/${userId}/search`,
        {
          params: {
            q: query,
          },
        }
      );

    return response.data;
  };

export default {
  getMessages,
  sendMessage,
  deleteMessage,
  editMessage,
  reactToMessage,
  searchMessages,
};