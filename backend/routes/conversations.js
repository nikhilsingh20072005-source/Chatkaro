const express = require("express");
const mongoose = require("mongoose");

const Conversation = require("../models/Conversation");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
DEBUG
==================================================
*/

console.log(
  "Conversation model:",
  typeof Conversation
);

console.log(
  "Conversation.findOne:",
  typeof Conversation.findOne
);

console.log(
  "Conversation.findById:",
  typeof Conversation.findById
);

console.log(
  "Conversation.create:",
  typeof Conversation.create
);

/*
==================================================
CREATE / GET PRIVATE CONVERSATION
POST /api/conversations/private
==================================================
*/

router.post(
  "/private",
  authMiddleware,
  async (req, res) => {
    try {
      const currentUserId =
        req.user.userId;

      const { userId } = req.body;

      console.log(
        "CREATE PRIVATE CONVERSATION:",
        {
          currentUserId,
          userId,
        }
      );

      /*
      ==============================================
      VALIDATE USER ID
      ==============================================
      */

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "User ID is required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID",
        });
      }

      /*
      ==============================================
      USER CANNOT CHAT WITH HIMSELF
      ==============================================
      */

      if (
        String(currentUserId) ===
        String(userId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot create conversation with yourself",
        });
      }

      /*
      ==============================================
      CHECK TARGET USER
      ==============================================
      */

      const targetUser =
        await User.findById(userId);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      /*
      ==============================================
      FIND EXISTING PRIVATE CONVERSATION
      ==============================================
      */

      let conversation =
        await Conversation.findOne({
          type: "private",

          participants: {
            $all: [
              currentUserId,
              userId,
            ],
          },
        });

      /*
      ==============================================
      CREATE NEW CONVERSATION
      ==============================================
      */

      if (!conversation) {
        conversation =
          await Conversation.create({
            type: "private",

            participants: [
              currentUserId,
              userId,
            ],

            lastMessage: null,

            lastMessageAt: null,
          });

        console.log(
          "NEW CONVERSATION CREATED:",
          conversation._id.toString()
        );
      } else {
        console.log(
          "EXISTING CONVERSATION:",
          conversation._id.toString()
        );
      }

      /*
      ==============================================
      POPULATE CONVERSATION
      ==============================================
      */

      conversation =
        await Conversation.findById(
          conversation._id
        )
          .populate(
            "participants",
            "-password"
          )
          .populate(
            "lastMessage"
          );

      /*
      ==============================================
      RESPONSE
      ==============================================
      */

      return res.status(200).json({
        success: true,

        message:
          "Private conversation ready",

        conversation,
      });
    } catch (error) {
      console.error(
        "PRIVATE CONVERSATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);

/*
==================================================
GET MY CONVERSATIONS
GET /api/conversations
==================================================
*/

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId =
        req.user.userId;

      const conversations =
        await Conversation.find({
          participants: userId,
        })
          .populate(
            "participants",
            "-password"
          )
          .populate(
            "lastMessage"
          )
          .sort({
            lastMessageAt: -1,
            updatedAt: -1,
          });

      return res.json({
        success: true,
        conversations,
      });
    } catch (error) {
      console.error(
        "GET CONVERSATIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  }
);

/*
==================================================
GET SINGLE CONVERSATION
GET /api/conversations/:conversationId
==================================================
*/

router.get(
  "/:conversationId",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        conversationId,
      } = req.params;

      const userId =
        req.user.userId;

      /*
      ============================================
      VALIDATE CONVERSATION ID
      ============================================
      */

      if (
        !mongoose.Types.ObjectId.isValid(
          conversationId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conversation ID",
        });
      }

      /*
      ============================================
      FIND CONVERSATION
      ============================================
      */

      const conversation =
        await Conversation.findById(
          conversationId
        )
          .populate(
            "participants",
            "-password"
          )
          .populate(
            "lastMessage"
          );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation not found",
        });
      }

      /*
      ============================================
      CHECK PARTICIPANT
      ============================================
      */

      const isParticipant =
        conversation.participants.some(
          (participant) =>
            String(
              participant._id
            ) ===
            String(userId)
        );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message:
            "You are not a participant of this conversation",
        });
      }

      return res.json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error(
        "GET CONVERSATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  }
);

/*
==================================================
DELETE / LEAVE CONVERSATION
DELETE /api/conversations/:conversationId
==================================================
*/

router.delete(
  "/:conversationId",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        conversationId,
      } = req.params;

      const userId =
        req.user.userId;

      /*
      ============================================
      VALIDATE ID
      ============================================
      */

      if (
        !mongoose.Types.ObjectId.isValid(
          conversationId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conversation ID",
        });
      }

      /*
      ============================================
      FIND CONVERSATION
      ============================================
      */

      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation not found",
        });
      }

      /*
      ============================================
      CHECK PARTICIPANT
      ============================================
      */

      const isParticipant =
        conversation.participants.some(
          (participant) =>
            String(participant) ===
            String(userId)
        );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message:
            "You are not a participant of this conversation",
        });
      }

      /*
      ============================================
      REMOVE USER
      ============================================
      */

      conversation.participants =
        conversation.participants.filter(
          (participant) =>
            String(participant) !==
            String(userId)
        );

      /*
      ============================================
      SAVE
      ============================================
      */

      await conversation.save();

      /*
      ============================================
      RESPONSE
      ============================================
      */

      return res.json({
        success: true,
        message:
          "You left the conversation",
      });
    } catch (error) {
      console.error(
        "LEAVE CONVERSATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  }
);

/*
==================================================
EXPORT
==================================================
*/

module.exports = router;