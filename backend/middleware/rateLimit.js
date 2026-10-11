const rateLimit = require("express-rate-limit");

/*
==================================================
GENERAL API RATE LIMIT
==================================================
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 300,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

/*
==================================================
AUTH RATE LIMIT
Login / Signup / Forgot Password
==================================================
*/

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

/*
==================================================
MESSAGE RATE LIMIT
==================================================
*/

const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 60,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many messages sent. Please slow down.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  messageLimiter,
};