const express = require("express");

const {
  sendMessage,
  getMessages,
  getMessageById,
  editMessage,
  deleteMessage,
  markMessageAsRead,
  addReaction,
  removeReaction,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
GET MESSAGES
GET /api/messages/:conversationId
==================================================
*/

router.get(
  "/:conversationId",
  authMiddleware,
  getMessages
);

/*
==================================================
SEND MESSAGE
POST /api/messages
==================================================
*/

router.post(
  "/",
  authMiddleware,
  sendMessage
);

/*
==================================================
GET SINGLE MESSAGE
GET /api/messages/message/:messageId
==================================================
*/

router.get(
  "/message/:messageId",
  authMiddleware,
  getMessageById
);

/*
==================================================
EDIT MESSAGE
PUT /api/messages/:messageId
==================================================
*/

router.put(
  "/:messageId",
  authMiddleware,
  editMessage
);

/*
==================================================
DELETE MESSAGE
DELETE /api/messages/:messageId
==================================================
*/

router.delete(
  "/:messageId",
  authMiddleware,
  deleteMessage
);

/*
==================================================
MARK MESSAGE AS READ
PUT /api/messages/:messageId/read
==================================================
*/

router.put(
  "/:messageId/read",
  authMiddleware,
  markMessageAsRead
);

/*
==================================================
ADD REACTION
POST /api/messages/:messageId/reaction
==================================================
*/

router.post(
  "/:messageId/reaction",
  authMiddleware,
  addReaction
);

/*
==================================================
REMOVE REACTION
DELETE /api/messages/:messageId/reaction
==================================================
*/

router.delete(
  "/:messageId/reaction",
  authMiddleware,
  removeReaction
);

module.exports = router;