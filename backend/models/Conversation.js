const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // private or group conversation
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
      required: true,
    },

    // Users participating in this conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Group-related fields
    groupName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    groupAvatar: {
      type: String,
      default: "",
    },

    // Last message reference
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    // Users who pinned this conversation
    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Users who muted this conversation
    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Users who archived this conversation
    archivedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Users who deleted/left the conversation
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Unread message count per user
    unreadCounts: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        count: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
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

// Find conversations of a particular user quickly
conversationSchema.index({
  participants: 1,
});

// Useful for sorting recent conversations
conversationSchema.index({
  lastMessageAt: -1,
});

// Useful for private conversations
conversationSchema.index({
  type: 1,
  participants: 1,
});


/*
========================================
MODEL
========================================
*/

module.exports =
  mongoose.models.Conversation ||
  mongoose.model(
    "Conversation",
    conversationSchema
  );