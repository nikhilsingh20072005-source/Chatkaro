import api from "./api";

export const getGroups =
  async () => {
    const response =
      await api.get(
        "/groups"
      );

    return response.data;
  };

export const getGroupById =
  async (groupId) => {
    const response =
      await api.get(
        `/groups/${groupId}`
      );

    return response.data;
  };

export const createGroup =
  async (groupData) => {
    const response =
      await api.post(
        "/groups",
        groupData
      );

    return response.data;
  };

export const updateGroup =
  async (
    groupId,
    groupData
  ) => {
    const response =
      await api.put(
        `/groups/${groupId}`,
        groupData
      );

    return response.data;
  };

export const deleteGroup =
  async (groupId) => {
    const response =
      await api.delete(
        `/groups/${groupId}`
      );

    return response.data;
  };

export const addGroupMember =
  async (
    groupId,
    userId
  ) => {
    const response =
      await api.post(
        `/groups/${groupId}/members`,
        { userId }
      );

    return response.data;
  };

export const removeGroupMember =
  async (
    groupId,
    userId
  ) => {
    const response =
      await api.delete(
        `/groups/${groupId}/members/${userId}`
      );

    return response.data;
  };

export const getGroupMembers =
  async (groupId) => {
    const response =
      await api.get(
        `/groups/${groupId}/members`
      );

    return response.data;
  };

export default {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  getGroupMembers,
};