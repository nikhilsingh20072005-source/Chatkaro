const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 250,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "online",
        "offline",
        "away",
        "busy",
      ],
      default: "offline",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },

      sound: {
        type: Boolean,
        default: true,
      },

      readReceipts: {
        type: Boolean,
        default: true,
      },

      typingIndicator: {
        type: Boolean,
        default: true,
      },

      theme: {
        type: String,
        enum: [
          "light",
          "dark",
          "system",
        ],
        default: "system",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );