const jwt = require("jsonwebtoken");

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    /*
    ==============================================
    GET TOKEN FROM HEADER
    ==============================================
    */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization token is required",
      });
    }

    /*
    ==============================================
    CHECK BEARER TOKEN
    ==============================================
    */

    if (
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Token is missing",
      });
    }

    /*
    ==============================================
    JWT SECRET
    ==============================================
    */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing in .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration error",
      });
    }

    /*
    ==============================================
    VERIFY TOKEN
    ==============================================
    */

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    /*
    ==============================================
    SAVE USER DATA IN REQUEST
    ==============================================
    */

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Token has expired. Please login again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid token. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed",
    });
  }
};

module.exports =
  authMiddleware;