const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    /*
    ========================================
    BASIC GROUP INFORMATION
    ========================================
    */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    avatar: {
      type: String,
      default: "",
    },

    /*
    ========================================
    GROUP CREATOR / OWNER
    ========================================
    */

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*
    ========================================
    GROUP MEMBERS
    ========================================
    */

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: [
            "owner",
            "admin",
            "member",
          ],
          default: "member",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },

        muted: {
          type: Boolean,
          default: false,
        },

        canSendMessages: {
          type: Boolean,
          default: true,
        },

        canSendMedia: {
          type: Boolean,
          default: true,
        },

        canAddMembers: {
          type: Boolean,
          default: false,
        },
      },
    ],

    /*
    ========================================
    CONVERSATION REFERENCE
    ========================================
    */

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    /*
    ========================================
    GROUP SETTINGS
    ========================================
    */

    settings: {
      onlyAdminsCanSend: {
        type: Boolean,
        default: false,
      },

      onlyAdminsCanEditInfo: {
        type: Boolean,
        default: true,
      },

      allowMemberAdd: {
        type: Boolean,
        default: true,
      },

      allowMemberInvite: {
        type: Boolean,
        default: true,
      },

      showMemberList: {
        type: Boolean,
        default: true,
      },
    },

    /*
    ========================================
    GROUP INVITE
    ========================================
    */

    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    inviteEnabled: {
      type: Boolean,
      default: true,
    },

    /*
    ========================================
    LAST MESSAGE
    ========================================
    */

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    /*
    ========================================
    GROUP STATUS
    ========================================
    */

    isActive: {
      type: Boolean,
      default: true,
    },

    deletedAt: {
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

groupSchema.index({
  owner: 1,
});

groupSchema.index({
  "members.user": 1,
});

groupSchema.index({
  conversation: 1,
});

groupSchema.index({
  lastMessageAt: -1,
});

/*
========================================
MODEL
========================================
*/

module.exports =
  mongoose.models.Group ||
  mongoose.model(
    "Group",
    groupSchema
  );