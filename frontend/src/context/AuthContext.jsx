import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../services/auth";

export const AuthContext =
  createContext(null);

const AuthContextProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const updateUser = useCallback(
    (updatedUser) => {
      setUser(updatedUser);

      if (updatedUser) {
        localStorage.setItem(
          "chatkaro_user",
          JSON.stringify(
            updatedUser
          )
        );
      }
    },
    []
  );

  const clearUser = useCallback(
    () => {
      setUser(null);

      localStorage.removeItem(
        "chatkaro_user"
      );

      localStorage.removeItem(
        "chatkaro_token"
      );
    },
    []
  );

  const checkAuth = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const savedUser =
          localStorage.getItem(
            "chatkaro_user"
          );

        if (savedUser) {
          try {
            setUser(
              JSON.parse(savedUser)
            );
          } catch {
            localStorage.removeItem(
              "chatkaro_user"
            );
          }
        }

        const response =
          await getCurrentUser();

        const currentUser =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          null;

        if (currentUser) {
          updateUser(
            currentUser
          );
        }
      } catch (err) {
        console.log(
          "AUTH CHECK:",
          err?.message
        );
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials) => {
      setError("");

      const response =
        await loginUser(
          credentials
        );

      const token =
        response?.token ||
        response?.data?.token;

      const loggedInUser =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        null;

      if (token) {
        localStorage.setItem(
          "chatkaro_token",
          token
        );
      }

      if (loggedInUser) {
        updateUser(
          loggedInUser
        );
      }

      return response;
    },
    [updateUser]
  );

  const signup = useCallback(
    async (userData) => {
      setError("");

      const response =
        await signupUser(
          userData
        );

      const token =
        response?.token ||
        response?.data?.token;

      const newUser =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        null;

      if (token) {
        localStorage.setItem(
          "chatkaro_token",
          token
        );
      }

      if (newUser) {
        updateUser(newUser);
      }

      return response;
    },
    [updateUser]
  );

  const logout = useCallback(
    async () => {
      try {
        await logoutUser();
      } catch (err) {
        console.log(
          "LOGOUT ERROR:",
          err?.message
        );
      } finally {
        clearUser();
      }
    },
    [clearUser]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated:
        Boolean(user),
      login,
      signup,
      logout,
      updateUser,
      clearUser,
      checkAuth,
    }),
    [
      user,
      loading,
      error,
      login,
      signup,
      logout,
      updateUser,
      clearUser,
      checkAuth,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = AuthContextProvider;

export default AuthContextProvider;