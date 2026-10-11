import api from "./api";

export const loginUser = async (
  credentials
) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const signupUser = async (
  userData
) => {
  const response = await api.post(
    "/auth/signup",
    userData
  );

  return response.data;
};

export const getCurrentUser =
  async () => {
    const response =
      await api.get(
        "/auth/me"
      );

    return response.data;
  };

export const logoutUser =
  async () => {
    try {
      const response =
        await api.post(
          "/auth/logout"
        );

      return response.data;
    } catch (error) {
      // Local logout should still
      // work if backend logout
      // endpoint is unavailable.
      console.log(
        "Logout API:",
        error?.message
      );

      return null;
    }
  };

export const forgotPassword =
  async (email) => {
    const response =
      await api.post(
        "/auth/forgot-password",
        { email }
      );

    return response.data;
  };

export const resetPassword =
  async (
    token,
    password
  ) => {
    const response =
      await api.post(
        `/auth/reset-password/${token}`,
        { password }
      );

    return response.data;
  };

export default {
  loginUser,
  signupUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};