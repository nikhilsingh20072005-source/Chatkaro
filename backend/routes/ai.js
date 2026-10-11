const express = require("express");

const {
  askAI,
} = require("../controllers/aiController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
AI CHAT
POST /api/ai
==================================================
*/

router.post(
  "/",
  authMiddleware,
  askAI
);

module.exports = router;