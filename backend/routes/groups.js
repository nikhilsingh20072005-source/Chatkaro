const express = require("express");

const {
  createGroup,
  getMyGroups,
  getGroup,
  updateGroup,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
} = require("../controllers/groupController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE GROUP
router.post(
  "/",
  authMiddleware,
  createGroup
);

// GET MY GROUPS
router.get(
  "/",
  authMiddleware,
  getMyGroups
);

// GET SINGLE GROUP
router.get(
  "/:groupId",
  authMiddleware,
  getGroup
);

// UPDATE GROUP
router.put(
  "/:groupId",
  authMiddleware,
  updateGroup
);

// ADD MEMBER
router.post(
  "/:groupId/members",
  authMiddleware,
  addMember
);

// REMOVE MEMBER
router.delete(
  "/:groupId/members/:userId",
  authMiddleware,
  removeMember
);

// LEAVE GROUP
router.post(
  "/:groupId/leave",
  authMiddleware,
  leaveGroup
);

// DELETE GROUP
router.delete(
  "/:groupId",
  authMiddleware,
  deleteGroup
);

module.exports = router;