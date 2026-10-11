const express = require("express");

const {
  getUsers,
  getMyProfile,
  getUserById,
  updateProfile,
  updateAvatar,
  searchUsers,
  getOnlineUsers,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const uploadMiddleware =
  require("../middleware/uploadMiddleware");

const router = express.Router();

/*
========================================
GET ALL USERS
GET /api/users
========================================
*/

router.get(
  "/",
  authMiddleware,
  getUsers
);

/*
========================================
MY PROFILE
GET /api/users/me
========================================
*/

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

/*
========================================
SEARCH USERS
GET /api/users/search?q=rishi
========================================
*/

router.get(
  "/search",
  authMiddleware,
  searchUsers
);

/*
========================================
ONLINE USERS
GET /api/users/online
========================================
*/

router.get(
  "/online",
  authMiddleware,
  getOnlineUsers
);

/*
========================================
UPDATE AVATAR
PUT /api/users/avatar
========================================
*/

router.put(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  updateAvatar
);

/*
========================================
GET USER BY ID
GET /api/users/:userId
========================================
*/

router.get(
  "/:userId",
  authMiddleware,
  getUserById
);

/*
========================================
UPDATE PROFILE
PUT /api/users/profile
========================================
*/

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

module.exports = router;