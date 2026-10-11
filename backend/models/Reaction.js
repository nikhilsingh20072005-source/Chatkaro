const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    /*
    ========================================
    MESSAGE
    ========================================
    */

    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      index: true,
    },

    /*
    ========================================
    USER
    ========================================
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
    ========================================
    EMOJI
    ========================================
    */

    emoji: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

/*
========================================
ONE USER → ONE REACTION PER MESSAGE
========================================
*/

reactionSchema.index(
  {
    message: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

/*
========================================
MODEL
========================================
*/

module.exports =
  mongoose.models.Reaction ||
  mongoose.model(
    "Reaction",
    reactionSchema
  );