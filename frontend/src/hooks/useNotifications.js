import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markNotificationAsRead,
} from "../services/users";

const useNotifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadNotifications =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getNotifications();

        const data =
          response?.notifications ||
          response?.data?.notifications ||
          response?.data ||
          [];

        setNotifications(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "NOTIFICATIONS ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load notifications."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead =
    useCallback(
      async (notificationId) => {
        if (!notificationId) {
          return;
        }

        try {
          await markNotificationAsRead(
            notificationId
          );

          setNotifications(
            (previous) =>
              previous.map(
                (notification) => {
                  const id =
                    notification?._id ||
                    notification?.id;

                  if (
                    String(id) ===
                    String(
                      notificationId
                    )
                  ) {
                    return {
                      ...notification,
                      read: true,
                      isRead: true,
                    };
                  }

                  return notification;
                }
              )
          );
        } catch (err) {
          console.error(
            "MARK NOTIFICATION ERROR:",
            err
          );
        }
      },
      []
    );

  const addNotification =
    useCallback(
      (notification) => {
        if (!notification) {
          return;
        }

        setNotifications(
          (previous) => [
            notification,
            ...previous,
          ]
        );
      },
      []
    );

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read &&
        !notification.isRead
    ).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    markAsRead,
    addNotification,
  };
};

export default useNotifications;