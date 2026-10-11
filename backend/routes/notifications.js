const express = require("express");

const {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
GET MY NOTIFICATIONS
GET /api/notifications
==================================================
*/

router.get(
  "/",
  authMiddleware,
  getNotifications
);

/*
==================================================
GET SINGLE NOTIFICATION
GET /api/notifications/:notificationId
==================================================
*/

router.get(
  "/:notificationId",
  authMiddleware,
  getNotificationById
);

/*
==================================================
MARK ONE AS READ
PUT /api/notifications/:notificationId/read
==================================================
*/

router.put(
  "/:notificationId/read",
  authMiddleware,
  markAsRead
);

/*
==================================================
MARK ALL AS READ
PUT /api/notifications/read-all
==================================================
*/

router.put(
  "/read-all",
  authMiddleware,
  markAllAsRead
);

/*
==================================================
DELETE ONE NOTIFICATION
DELETE /api/notifications/:notificationId
==================================================
*/

router.delete(
  "/:notificationId",
  authMiddleware,
  deleteNotification
);

/*
==================================================
CLEAR ALL NOTIFICATIONS
DELETE /api/notifications
==================================================
*/

router.delete(
  "/",
  authMiddleware,
  clearNotifications
);

module.exports = router;