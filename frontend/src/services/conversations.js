import { post } from "./api";

export const createPrivateConversation = async (userId) => {
  return await post("/conversations/private", {
    userId,
  });
};