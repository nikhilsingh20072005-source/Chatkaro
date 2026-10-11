const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
} = require("../utils/password");
const generateToken = require("../utils/generateToken");
const {
  isValidEmail,
  isValidUsername,
  isValidPassword,
} = require("../utils/validators");

/*
========================================
SIGNUP
POST /api/auth/signup
========================================
*/

const signup = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const cleanUsername =
      String(username || "").trim();

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    /*
    -----------------------------
    VALIDATION
    -----------------------------
    */

    if (
      !isValidUsername(
        cleanUsername
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3-30 characters and contain only letters, numbers or underscore",
      });
    }

    if (
      !isValidEmail(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email",
      });
    }

    if (
      !isValidPassword(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    /*
    -----------------------------
    CHECK EXISTING USER
    -----------------------------
    */

    const existingUser =
      await User.findOne({
        $or: [
          {
            email: cleanEmail,
          },
          {
            username: cleanUsername,
          },
        ],
      });

    if (existingUser) {
      if (
        existingUser.email ===
        cleanEmail
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Email already registered",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "Username already taken",
      });
    }

    /*
    -----------------------------
    HASH PASSWORD
    -----------------------------
    */

    const hashedPassword =
      await hashPassword(password);

    /*
    -----------------------------
    CREATE USER
    -----------------------------
    */

    const user =
      await User.create({
        username:
          cleanUsername,

        email:
          cleanEmail,

        password:
          hashedPassword,

        isOnline: true,
        lastSeen: new Date(),
      });

    /*
    -----------------------------
    TOKEN
    -----------------------------
    */

    const token =
      generateToken(user);

    /*
    -----------------------------
    RESPONSE
    -----------------------------
    */

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",

      token,

      user: {
        _id: user._id,
        username:
          user.username,
        email: user.email,
        avatar:
          user.avatar || "",
        bio:
          user.bio || "",
        isOnline:
          user.isOnline,
        lastSeen:
          user.lastSeen,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
LOGIN
POST /api/auth/login
========================================
*/

const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    if (
      !isValidEmail(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required",
      });
    }

    /*
    -----------------------------
    FIND USER
    -----------------------------
    */

    const user =
      await User.findOne({
        email: cleanEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    /*
    -----------------------------
    CHECK PASSWORD
    -----------------------------
    */

    const passwordMatch =
      await comparePassword(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    /*
    -----------------------------
    UPDATE ONLINE STATUS
    -----------------------------
    */

    user.isOnline = true;
    user.lastSeen = new Date();

    await user.save();

    /*
    -----------------------------
    TOKEN
    -----------------------------
    */

    const token =
      generateToken(user);

    /*
    -----------------------------
    RESPONSE
    -----------------------------
    */

    return res.json({
      success: true,
      message:
        "Login successful",

      token,

      user: {
        _id: user._id,
        username:
          user.username,
        email:
          user.email,
        avatar:
          user.avatar || "",
        bio:
          user.bio || "",
        isOnline:
          user.isOnline,
        lastSeen:
          user.lastSeen,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
GET CURRENT USER
GET /api/auth/me
========================================
*/

const getMe = async (
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

/*
========================================
LOGOUT
POST /api/auth/logout
========================================
*/

const logout = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user.userId;

    await User.findByIdAndUpdate(
      userId,
      {
        isOnline: false,
        lastSeen: new Date(),
      }
    );

    return res.json({
      success: true,
      message:
        "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
FORGOT PASSWORD
POST /api/auth/forgot-password
========================================

NOTE:
Actual email sending will be
connected later.
========================================
*/

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } =
      req.body;

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    if (
      !isValidEmail(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email",
      });
    }

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    /*
    Security:
    Don't reveal whether email
    exists or not.
    */

    if (!user) {
      return res.json({
        success: true,
        message:
          "If this email is registered, password reset instructions will be sent",
      });
    }

    /*
    Temporary response.

    Email service will be added
    later with a secure reset token.
    */

    return res.json({
      success: true,
      message:
        "Password reset request received",
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
RESET PASSWORD
POST /api/auth/reset-password
========================================

This endpoint is prepared for
reset-token integration.
========================================
*/

const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      token,
      password,
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is required",
      });
    }

    if (
      !isValidPassword(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    /*
    Secure reset-token model/service
    will be connected here.

    We intentionally do not
    change password using an
    unverified token.
    */

    return res.status(501).json({
      success: false,
      message:
        "Password reset service is not configured yet",
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
  signup,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};