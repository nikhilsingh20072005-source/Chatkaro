const mongoose = require("mongoose");

const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  } = require("../utils/password");

const {
  isValidEmail,
  isValidUsername,
  isValidPassword,
} = require("../utils/validators");

/*
========================================
GET MY PROFILE
GET /api/users/me
========================================
*/

const getMyProfile = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user.userId;

    const user =
      await User.findById(
        userId
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (
  req,
  res,
  next
) => {
  try {
    const currentUserId =
      req.user.userId;

    const users =
      await User.find({
        _id: {
          $ne: currentUserId,
        },
      })
        .select("-password")
        .sort({
          username: 1,
        });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getOnlineUsers = async (
  req,
  res,
  next
) => {
  try {
    const currentUserId =
      req.user.userId;

    const users =
      await User.find({
        _id: {
          $ne: currentUserId,
        },
        isOnline: true,
      })
        .select("-password")
        .sort({
          username: 1,
        });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
GET USER BY ID
GET /api/users/:userId
========================================
*/

const getUserById = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
    } = req.params;

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

    const user =
      await User.findById(
        userId
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
SEARCH USERS
GET /api/users/search?q=rishi
========================================
*/

const searchUsers = async (
  req,
  res,
  next
) => {
  try {
    const query =
      String(
        req.query.q || ""
      ).trim();

    if (!query) {
      return res.json({
        success: true,
        users: [],
      });
    }

    const currentUserId =
      req.user.userId;

    const users =
      await User.find({
        _id: {
          $ne: currentUserId,
        },

        username: {
          $regex: query,
          $options: "i",
        },
      })
        .select(
          "-password"
        )
        .limit(20);

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
UPDATE PROFILE
PUT /api/users/profile
========================================
*/

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user.userId;

    const {
      username,
      email,
      bio,
      avatar,
    } = req.body;

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    /*
    --------------------------------
    USERNAME
    --------------------------------
    */

    if (
      username !== undefined
    ) {
      const cleanUsername =
        String(
          username
        ).trim();

      if (
        !isValidUsername(
          cleanUsername
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid username",
        });
      }

      const usernameExists =
        await User.findOne({
          username:
            cleanUsername,

          _id: {
            $ne: userId,
          },
        });

      if (usernameExists) {
        return res.status(409).json({
          success: false,
          message:
            "Username already taken",
        });
      }

      user.username =
        cleanUsername;
    }

    /*
    --------------------------------
    EMAIL
    --------------------------------
    */

    if (
      email !== undefined
    ) {
      const cleanEmail =
        String(
          email
        )
          .trim()
          .toLowerCase();

      if (
        !isValidEmail(
          cleanEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid email",
        });
      }

      const emailExists =
        await User.findOne({
          email:
            cleanEmail,

          _id: {
            $ne: userId,
          },
        });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message:
            "Email already registered",
        });
      }

      user.email =
        cleanEmail;
    }

    /*
    --------------------------------
    BIO
    --------------------------------
    */

    if (
      bio !== undefined
    ) {
      user.bio =
        String(bio)
          .trim()
          .slice(0, 500);
    }

    /*
    --------------------------------
    AVATAR
    --------------------------------
    */

    if (
      avatar !== undefined
    ) {
      user.avatar =
        String(avatar).trim();
    }

    await user.save();

    const updatedUser =
      await User.findById(
        userId
      ).select("-password");

    return res.json({
      success: true,
      message:
        "Profile updated successfully",
      user:
        updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
UPDATE AVATAR
PUT /api/users/avatar
========================================
*/

const updateAvatar = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select an image",
      });
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    /*
    --------------------------------
    AVATAR URL
    --------------------------------
    */

    const avatarUrl =
      `/uploads/${req.file.filename}`;

    user.avatar =
      avatarUrl;

    await user.save();

    const updatedUser =
      await User.findById(
        userId
      ).select("-password");

    return res.json({
      success: true,
      message:
        "Profile photo updated successfully",
      user:
        updatedUser,
    });

  } catch (error) {
    next(error);
  }
};

/*
========================================
CHANGE PASSWORD
PUT /api/users/change-password
========================================
*/

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user.userId;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (
      !isValidPassword(
        newPassword
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    const user =
      await User.findById(
        userId
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const passwordMatch =
      await comparePassword(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    user.password =
      await hashPassword(
        newPassword
      );

    await user.save();

    return res.json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
DELETE MY ACCOUNT
DELETE /api/users/me
========================================
*/

const deleteMyAccount =
  async (
    req,
    res,
    next
  ) => {
    try {
      const userId =
        req.user.userId;

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      await User.findByIdAndDelete(
        userId
      );

      return res.json({
        success: true,
        message:
          "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

/*
========================================
SET ONLINE STATUS
PUT /api/users/status
========================================
*/

const updateOnlineStatus =
  async (
    req,
    res,
    next
  ) => {
    try {
      const userId =
        req.user.userId;

      const {
        isOnline,
      } = req.body;

      const user =
        await User.findByIdAndUpdate(
          userId,
          {
            isOnline:
              Boolean(
                isOnline
              ),

            lastSeen:
              new Date(),
          },
          {
            new: true,
          }
        ).select(
          "-password"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

/*
========================================
EXPORT
========================================
*/
module.exports = {
  getUsers,
  getMyProfile,
  getUserById,
  searchUsers,
  updateProfile,
  updateAvatar,
  changePassword,
  deleteMyAccount,
  updateOnlineStatus,
  getOnlineUsers,
};