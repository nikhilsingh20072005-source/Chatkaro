
import api from "./api";

/*
========================================
GET USERS
========================================
*/

export const getUsers = async (
  search = ""
) => {
  const response = await api.get(
    "/users",
    {
      params: {
        search,
      },
    }
  );

  return response.data;
};

/*
========================================
GET USER BY ID
========================================
*/

export const getUserById = async (
  userId
) => {
  const response = await api.get(
    `/users/${userId}`
  );

  return response.data;
};

/*
========================================
UPDATE PROFILE
========================================
*/

export const updateProfile = async (
  userData
) => {
  const response = await api.put(
    "/users/profile",
    userData
  );

  return response.data;
};

/*
========================================
CHANGE PASSWORD
PUT /api/users/change-password
========================================
*/

export const changePassword = async (
  currentPassword,
  newPassword
) => {
  const response = await api.put(
    "/users/change-password",
    {
      currentPassword,
      newPassword,
    }
  );

  return response.data;
};

/*
========================================
GET NOTIFICATIONS
========================================
*/

export const getNotifications =
  async () => {
    const response =
      await api.get(
        "/users/notifications"
      );

    return response.data;
  };

/*
========================================
MARK NOTIFICATION AS READ
========================================
*/

export const markNotificationAsRead =
  async (notificationId) => {
    const response =
      await api.put(
        `/users/notifications/${notificationId}/read`
      );

    return response.data;
  };

/*
========================================
UPDATE AVATAR
========================================
*/

export const updateAvatar =
  async (file) => {
    const formData =
      new FormData();

    formData.append(
      "avatar",
      file
    );

    const response =
      await api.put(
        "/users/avatar",
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

/*
========================================
SEARCH USERS
========================================
*/

export const searchUsers =
  async (query) => {
    const response =
      await api.get(
        "/users/search",
        {
          params: {
            q: query,
          },
        }
      );

    return response.data;
  };

/*
========================================
DEFAULT EXPORT
========================================
*/

export default {
  getUsers,
  getUserById,
  updateProfile,
  changePassword,
  getNotifications,
  markNotificationAsRead,
  updateAvatar,
  searchUsers,
};

