
const mongoose = require("mongoose");

const Group = require("../models/Group");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

/*
==================================================
HELPERS
==================================================
*/

const getUserId = (req) =>
  req.user?.userId || req.user?.id || req.user?._id;

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const isGroupMember = (group, userId) =>
  group.members.some(
    (member) =>
      String(member.user?._id || member.user) ===
      String(userId)
  );

const isGroupAdmin = (group, userId) => {
  const id = String(userId);

  if (String(group.owner) === id) {
    return true;
  }

  return group.members.some(
    (member) =>
      String(member.user?._id || member.user) === id &&
      ["owner", "admin"].includes(member.role)
  );
};

const populateGroup = (query) =>
  query
    .populate("owner", "username name email avatar profilePicture")
    .populate(
      "members.user",
      "username name email avatar profilePicture"
    )
    .populate("conversation");

/*
==================================================
CREATE GROUP
POST /api/groups
==================================================
*/

const createGroup = async (req, res) => {
  let conversation = null;

  try {
    const currentUserId = getUserId(req);

    const {
      name,
      description = "",
      members = [],
      avatar = "",
    } = req.body;

    if (!currentUserId || !isValidId(currentUserId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user",
      });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Group name must contain at least 2 characters",
      });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Members must be an array",
      });
    }

    if (
      typeof description !== "string" ||
      typeof avatar !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid group information",
      });
    }

    const memberIds = [
      ...new Set(
        [...members, String(currentUserId)]
          .map((id) => String(id))
      ),
    ];

    if (!memberIds.every(isValidId)) {
      return res.status(400).json({
        success: false,
        message: "One or more member IDs are invalid",
      });
    }

    const users = await User.find({
      _id: { $in: memberIds },
    }).select("_id");

    if (users.length !== memberIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more users were not found",
      });
    }

    /*
    Create the conversation first.
    Every group member becomes a participant.
    */

    conversation = await Conversation.create({
      type: "group",
      participants: memberIds,
      groupName: name.trim(),
      groupAvatar: avatar.trim(),
    });

    /*
    Save members using Group.js subdocument structure.
    */

    const group = await Group.create({
      name: name.trim(),
      description: description.trim(),
      avatar: avatar.trim(),
      owner: currentUserId,
      members: memberIds.map((userId) => ({
        user: userId,
        role:
          String(userId) === String(currentUserId)
            ? "owner"
            : "member",
      })),
      conversation: conversation._id,
    });

    const populatedGroup = await populateGroup(
      Group.findById(group._id)
    );

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: populatedGroup,
    });
  } catch (error) {
    // Avoid leaving an unused conversation if group creation fails.
    if (conversation?._id) {
      await Conversation.findByIdAndDelete(
        conversation._id
      ).catch(() => {});
    }

    console.error("CREATE GROUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Could not create group",
      error: error,
    });
  }
};

/*
==================================================
GET MY GROUPS
GET /api/groups
==================================================
*/

const getMyGroups = async (req, res) => {
  try {
    const userId = getUserId(req);

    const groups = await populateGroup(
      Group.find({
        isActive: true,
        $or: [
          { owner: userId },
          { "members.user": userId },
        ],
      }).sort({ updatedAt: -1 })
    );

    return res.json({
      success: true,
      groups,
    });
  } catch (error) {
    console.error("GET GROUPS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load groups",
    });
  }
};

/*
==================================================
GET SINGLE GROUP
GET /api/groups/:groupId
==================================================
*/

const getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = getUserId(req);

    if (!isValidId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    const group = await populateGroup(
      Group.findOne({
        _id: groupId,
        isActive: true,
      })
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (!isGroupMember(group, userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not a group member",
      });
    }

    return res.json({
      success: true,
      group,
    });
  } catch (error) {
    console.error("GET GROUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load group",
    });
  }
};

/*
==================================================
ADD MEMBER
POST /api/groups/:groupId/members
==================================================
*/

const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const currentUserId = getUserId(req);

    if (!isValidId(groupId) || !isValidId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group or user ID",
      });
    }

    const group = await Group.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (!isGroupAdmin(group, currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can add members",
      });
    }

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isGroupMember(group, userId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    group.members.push({
      user: userId,
      role: "member",
    });

    await group.save();

    if (group.conversation) {
      await Conversation.findByIdAndUpdate(
        group.conversation,
        {
          $addToSet: {
            participants: userId,
          },
          $pull: {
            deletedBy: userId,
          },
        }
      );
    }

    const updatedGroup = await populateGroup(
      Group.findById(group._id)
    );

    return res.json({
      success: true,
      message: "Member added successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not add member",
    });
  }
};

/*
==================================================
REMOVE MEMBER
DELETE /api/groups/:groupId/members/:userId
==================================================
*/

const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const currentUserId = getUserId(req);

    if (!isValidId(groupId) || !isValidId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const group = await Group.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (!isGroupAdmin(group, currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can remove members",
      });
    }

    if (
      String(userId) === String(group.owner) ||
      String(userId) === String(currentUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "The owner or acting admin cannot remove themselves here",
      });
    }

    group.members = group.members.filter(
      (member) => String(member.user) !== String(userId)
    );

    await group.save();

    if (group.conversation) {
      await Conversation.findByIdAndUpdate(
        group.conversation,
        {
          $pull: {
            participants: userId,
          },
          $addToSet: {
            deletedBy: userId,
          },
        }
      );
    }

    return res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("REMOVE MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not remove member",
    });
  }
};

/*
==================================================
LEAVE GROUP
POST /api/groups/:groupId/leave
==================================================
*/

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = getUserId(req);

    if (!isValidId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    const group = await Group.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (String(group.owner) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "Group owner cannot leave without transferring ownership",
      });
    }

    if (!isGroupMember(group, userId)) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    group.members = group.members.filter(
      (member) => String(member.user) !== String(userId)
    );

    await group.save();

    if (group.conversation) {
      await Conversation.findByIdAndUpdate(
        group.conversation,
        {
          $pull: {
            participants: userId,
          },
          $addToSet: {
            deletedBy: userId,
          },
        }
      );
    }

    return res.json({
      success: true,
      message: "You left the group successfully",
    });
  } catch (error) {
    console.error("LEAVE GROUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not leave group",
    });
  }
};

/*
==================================================
UPDATE GROUP
PUT /api/groups/:groupId
==================================================
*/

const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, groupAvatar } = req.body;
    const userId = getUserId(req);

    if (!isValidId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    const group = await Group.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can update group information",
      });
    }

    if (typeof name === "string" && name.trim()) {
      group.name = name.trim();
    }

    if (typeof description === "string") {
      group.description = description.trim();
    }

    if (typeof groupAvatar === "string") {
      group.avatar = groupAvatar.trim();
    }

    await group.save();

    if (group.conversation) {
      await Conversation.findByIdAndUpdate(
        group.conversation,
        {
          groupName: group.name,
          groupAvatar: group.avatar,
        }
      );
    }

    const updatedGroup = await populateGroup(
      Group.findById(group._id)
    );

    return res.json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("UPDATE GROUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not update group",
    });
  }
};

/*
==================================================
DELETE GROUP
DELETE /api/groups/:groupId
==================================================
*/

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = getUserId(req);

    if (!isValidId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    const group = await Group.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (String(group.owner) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the group owner can delete the group",
      });
    }

    // Soft-delete the group so its history is not immediately erased.
    group.isActive = false;
    group.deletedAt = new Date();

    await group.save();

    return res.json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("DELETE GROUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not delete group",
    });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  removeMember,
  leaveGroup,
  updateGroup,
  deleteGroup,
};

