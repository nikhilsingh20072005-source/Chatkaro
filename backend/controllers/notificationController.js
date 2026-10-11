const mongoose = require("mongoose");
const Notification = require("../models/Notification");

/*
==================================================
GET MY NOTIFICATIONS
GET /api/notifications
==================================================
*/

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications =
      await Notification.find({
        recipient: userId,
      })
        .populate("sender", "-password")
        .populate("message")
        .populate("conversation")
        .populate("group")
        .sort({
          createdAt: -1,
        })
        .limit(100);

    return res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
GET SINGLE NOTIFICATION
GET /api/notifications/:notificationId
==================================================
*/

const getNotificationById = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        notificationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification =
      await Notification.findOne({
        _id: notificationId,
        recipient: userId,
      })
        .populate("sender", "-password")
        .populate("message")
        .populate("conversation")
        .populate("group");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
MARK ONE AS READ
PUT /api/notifications/:notificationId/read
==================================================
*/

const markAsRead = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        notificationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          recipient: userId,
        },
        {
          isRead: true,
          readAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
MARK ALL AS READ
PUT /api/notifications/read-all
==================================================
*/

const markAllAsRead = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const result =
      await Notification.updateMany(
        {
          recipient: userId,
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );

    return res.json({
      success: true,
      message:
        "All notifications marked as read",
      modifiedCount:
        result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
DELETE ONE NOTIFICATION
DELETE /api/notifications/:notificationId
==================================================
*/

const deleteNotification = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        notificationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification =
      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE NOTIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
CLEAR ALL NOTIFICATIONS
DELETE /api/notifications
==================================================
*/

const clearNotifications = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const result =
      await Notification.deleteMany({
        recipient: userId,
      });

    return res.json({
      success: true,
      message:
        "All notifications cleared",
      deletedCount:
        result.deletedCount,
    });
  } catch (error) {
    console.error(
      "CLEAR NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
EXPORT
==================================================
*/

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
};