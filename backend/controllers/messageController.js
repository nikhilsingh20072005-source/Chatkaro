const mongoose = require("mongoose");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

/*
==================================================
SEND MESSAGE
POST /api/messages
==================================================
*/

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;

    const {
      conversationId,
      content = "",
      type = "text",
      file = null,
      replyTo = null,
    } = req.body;

    console.log("SEND MESSAGE:", {
      senderId,
      conversationId,
      content,
      type,
      file,
    });

    /*
    ==============================
    VALIDATE CONVERSATION ID
    ==============================
    */

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        conversationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    /*
    ==============================
    VALIDATE MESSAGE
    ==============================
    */

    const hasText =
      typeof content === "string" &&
      content.trim().length > 0;

    const hasFile =
      file &&
      typeof file === "object" &&
      file.url;

    if (!hasText && !hasFile) {
      return res.status(400).json({
        success: false,
        message:
          "Message content or file is required",
      });
    }

    /*
    ==============================
    VALIDATE TYPE
    ==============================
    */

    const allowedTypes = [
      "text",
      "image",
      "file",
      "audio",
      "video",
      "voice",
      "system",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message type",
      });
    }

    /*
    ==============================
    FIND CONVERSATION
    ==============================
    */

    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    /*
    ==============================
    CHECK PARTICIPANT
    ==============================
    */

    const isParticipant =
      conversation.participants.some(
        (participant) =>
          String(participant) ===
          String(senderId)
      );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a participant of this conversation",
      });
    }

    /*
    ==============================
    CREATE MESSAGE
    ==============================
    */

    const message =
      await Message.create({
        conversation: conversationId,

        sender: senderId,

        content: hasText
          ? content.trim()
          : "",

        type,

        file: hasFile
          ? {
            url: file.url || "",
            filename:
              file.filename || "",
            originalName:
              file.originalName || "",
            mimeType:
              file.mimeType ||
              file.mimetype ||
              "",
            size:
              Number(file.size) || 0,
          }
          : undefined,

        replyTo:
          replyTo &&
            mongoose.Types.ObjectId.isValid(
              replyTo
            )
            ? replyTo
            : null,

        readBy: [
          {
            user: senderId,
            readAt: new Date(),
          },
        ],
      });

    /*
    ==============================
    UPDATE CONVERSATION
    ==============================
    */

    conversation.lastMessage =
      message._id;

    conversation.lastMessageAt =
      message.createdAt;

    await conversation.save();

    /*
    ==============================
    POPULATE MESSAGE
    ==============================
    */

    const populatedMessage =
      await Message.findById(
        message._id
      )
        .populate(
          "sender",
          "-password"
        )
        .populate(
          "replyTo"
        );

    /*
    ==============================
    RESPONSE
    ==============================
    */

    return res.status(201).json({
      success: true,

      message:
        "Message sent successfully",

      data: populatedMessage,
    });

  } catch (error) {
    console.error(
      "SEND MESSAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
GET MESSAGES
GET /api/messages/:conversationId
==================================================
*/

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      conversationId,
    } = req.params;

    /*
    ==============================
    VALIDATE ID
    ==============================
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
    ==============================
    FIND CONVERSATION
    ==============================
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
    ==============================
    CHECK PARTICIPANT
    ==============================
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
    ==============================
    GET MESSAGES
    ==============================
    */

    const messages =
      await Message.find({
        conversation:
          conversationId,
      })
        .populate(
          "sender",
          "-password"
        )
        .populate(
          "replyTo"
        )
        .sort({
          createdAt: 1,
        });

    /*
    ==============================
    RESPONSE
    ==============================
    */

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "GET MESSAGES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
DELETE MESSAGE
DELETE /api/messages/:messageId
==================================================
*/

const deleteMessage = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const {
      messageId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        messageId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const message =
      await Message.findById(
        messageId
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    /*
    Only sender can delete
    */

    if (
      String(message.sender) !==
      String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own message",
      });
    }

    /*
    Soft delete
    */

    message.deleted = true;

    message.content =
      "This message was deleted";

    await message.save();

    return res.json({
      success: true,
      message:
        "Message deleted successfully",
      data: message,
    });
  } catch (error) {
    console.error(
      "DELETE MESSAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
GET SINGLE MESSAGE
GET /api/messages/message/:messageId
==================================================
*/

const getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const message = await Message.findById(messageId)
      .populate("sender", "-password")
      .populate("replyTo");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const conversation = await Conversation.findById(
      message.conversation
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) =>
        String(participant) === String(userId)
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    return res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("GET MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/*
==================================================
EDIT MESSAGE
PUT /api/messages/:messageId
==================================================
*/

const editMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const hasContent =
      typeof content === "string" &&
      content.trim().length > 0;

    const hasFile =
      file &&
      typeof file === "object" &&
      file.url;

    if (!hasContent && !hasFile) {
      return res.status(400).json({
        success: false,
        message:
          "Message content or file is required",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (String(message.sender) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own message",
      });
    }

    message.content = content.trim();
    message.edited = true;

    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "-password")
      .populate("replyTo");

    return res.json({
      success: true,
      message: "Message edited successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("EDIT MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/*
==================================================
MARK MESSAGE AS READ
PUT /api/messages/:messageId/read
==================================================
*/

const markMessageAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const alreadyRead = message.readBy?.some(
      (item) => String(item.user) === String(userId)
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: userId,
        readAt: new Date(),
      });

      await message.save();
    }

    return res.json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    console.error("MARK READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/*
==================================================
ADD REACTION
POST /api/messages/:messageId/reaction
==================================================
*/

const addReaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    if (!emoji || !String(emoji).trim()) {
      return res.status(400).json({
        success: false,
        message: "Emoji is required",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (!message.reactions) {
      message.reactions = [];
    }

    message.reactions = message.reactions.filter(
      (reaction) =>
        String(reaction.user) !== String(userId)
    );

    message.reactions.push({
      user: userId,
      emoji: String(emoji).trim(),
    });

    await message.save();

    return res.json({
      success: true,
      message: "Reaction added",
      data: message,
    });
  } catch (error) {
    console.error("ADD REACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/*
==================================================
REMOVE REACTION
DELETE /api/messages/:messageId/reaction
==================================================
*/

const removeReaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.reactions) {
      message.reactions = message.reactions.filter(
        (reaction) =>
          String(reaction.user) !== String(userId)
      );
    }

    await message.save();

    return res.json({
      success: true,
      message: "Reaction removed",
      data: message,
    });
  } catch (error) {
    console.error("REMOVE REACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
==================================================
EXPORT
==================================================
*/

module.exports = {
  sendMessage,
  getMessages,
  getMessageById,
  editMessage,
  deleteMessage,
  markMessageAsRead,
  addReaction,
  removeReaction,
};