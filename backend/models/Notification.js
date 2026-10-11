const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    /*
    ========================================
    RECEIVER
    ========================================
    */

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
    ========================================
    SENDER
    ========================================
    */

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /*
    ========================================
    NOTIFICATION TYPE
    ========================================
    */

    type: {
      type: String,
      enum: [
        "message",
        "mention",
        "reaction",
        "reply",
        "friend_request",
        "friend_accepted",
        "group_invite",
        "group_added",
        "group_removed",
        "group_admin",
        "call",
        "system",
        "ai",
      ],
      required: true,
    },

    /*
    ========================================
    MESSAGE
    ========================================
    */

    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    /*
    ========================================
    CONVERSATION
    ========================================
    */

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    /*
    ========================================
    GROUP
    ========================================
    */

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    /*
    ========================================
    TITLE
    ========================================
    */

    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    /*
    ========================================
    CONTENT
    ========================================
    */

    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    /*
    ========================================
    READ STATUS
    ========================================
    */

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    /*
    ========================================
    EXTRA DATA
    ========================================
    */

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /*
    ========================================
    EXPIRATION
    ========================================
    */

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
========================================
INDEXES
========================================
*/

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  isRead: 1,
});

notificationSchema.index({
  sender: 1,
  createdAt: -1,
});

/*
========================================
MODEL
========================================
*/

module.exports =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );