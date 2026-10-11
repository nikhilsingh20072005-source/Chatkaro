const express = require("express");

const {
  signup,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
SIGNUP
POST /api/auth/signup
==================================================
*/

router.post(
  "/signup",
  signup
);

/*
==================================================
LOGIN
POST /api/auth/login
==================================================
*/

router.post(
  "/login",
  login
);

/*
==================================================
GET CURRENT USER
GET /api/auth/me
==================================================
*/

router.get(
  "/me",
  authMiddleware,
  getMe
);

/*
==================================================
LOGOUT
POST /api/auth/logout
==================================================
*/

router.post(
  "/logout",
  authMiddleware,
  logout
);

/*
==================================================
FORGOT PASSWORD
POST /api/auth/forgot-password
==================================================
*/

router.post(
  "/forgot-password",
  forgotPassword
);

/*
==================================================
RESET PASSWORD
POST /api/auth/reset-password
==================================================
*/

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;