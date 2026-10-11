const jwt = require("jsonwebtoken");

/*
========================================
GENERATE JWT TOKEN
========================================
*/

const generateToken = (user) => {
  if (!user) {
    throw new Error(
      "User is required to generate token"
    );
  }

  const userId =
    user._id ||
    user.id;

  if (!userId) {
    throw new Error(
      "User ID is required to generate token"
    );
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is missing in .env"
    );
  }

  const token =
    jwt.sign(
      {
        userId: String(userId),
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

  return token;
};

module.exports =
  generateToken;