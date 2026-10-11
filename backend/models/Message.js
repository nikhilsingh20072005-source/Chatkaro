const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    /*
    ========================================
    CONVERSATION
    ========================================
    */

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
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
      required: true,
      index: true,
    },

    /*
    ========================================
    MESSAGE TYPE
    ========================================
    */

    type: {
      type: String,
      enum: [
        "text",
        "image",
        "file",
        "audio",
        "video",
        "voice",
        "system",
      ],
      default: "text",
    },

    /*
    ========================================
    MESSAGE CONTENT
    ========================================
    */

    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 10000,
    },

    /*
    ========================================
    MEDIA / FILE
    ========================================
    */

    file: {
      url: {
        type: String,
        default: "",
      },

      filename: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },
    },

    /*
    ========================================
    REPLY
    ========================================
    */

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    /*
    ========================================
    FORWARD
    ========================================
    */

    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    isForwarded: {
      type: Boolean,
      default: false,
    },

    /*
    ========================================
    EDIT
    ========================================
    */

    edited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    /*
    ========================================
    DELETE
    ========================================
    */

    deleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    /*
    ========================================
    READ STATUS
    ========================================
    */

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        readAt: {
          type: Date,
          default: null,
        },
      },
    ],

    /*
    ========================================
    DELIVERY STATUS
    ========================================
    */

    deliveredTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        deliveredAt: {
          type: Date,
          default: null,
        },
      },
    ],

    /*
    ========================================
    REACTIONS
    ========================================
    */

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        emoji: {
          type: String,
          trim: true,
          maxlength: 10,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /*
    ========================================
    PINNED MESSAGE
    ========================================
    */

    pinned: {
      type: Boolean,
      default: false,
    },

    pinnedAt: {
      type: Date,
      default: null,
    },

    pinnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /*
    ========================================
    AI SUPPORT
    ========================================
    */

    aiGenerated: {
      type: Boolean,
      default: false,
    },

    aiModel: {
      type: String,
      default: "",
    },

    /*
    ========================================
    SYSTEM MESSAGE
    ========================================
    */

    systemAction: {
      type: String,
      default: "",
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

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

messageSchema.index({
  sender: 1,
  createdAt: -1,
});

messageSchema.index({
  conversation: 1,
  type: 1,
});

/*
========================================
MODEL
========================================
*/

module.exports =
  mongoose.models.Message ||
  mongoose.model(
    "Message",
    messageSchema
  );