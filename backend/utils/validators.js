/*
========================================
VALIDATION HELPERS
========================================
*/

/*
----------------------------------------
EMAIL
----------------------------------------
*/

const isValidEmail = (email) => {
  if (!email) {
    return false;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(
    String(email).trim()
  );
};

/*
----------------------------------------
USERNAME
----------------------------------------
*/

const isValidUsername = (
  username
) => {
  if (!username) {
    return false;
  }

  const value =
    String(username).trim();

  /*
  Username:
  - 3 to 30 characters
  - letters
  - numbers
  - underscore
  */

  const usernameRegex =
    /^[a-zA-Z0-9_]{3,30}$/;

  return usernameRegex.test(value);
};

/*
----------------------------------------
PASSWORD
----------------------------------------
*/

const isValidPassword = (
  password
) => {
  if (!password) {
    return false;
  }

  /*
  Minimum 6 characters
  */

  return String(password).length >= 6;
};

/*
----------------------------------------
MESSAGE
----------------------------------------
*/

const isValidMessage = (
  message
) => {
  if (
    message === undefined ||
    message === null
  ) {
    return false;
  }

  const value =
    String(message).trim();

  /*
  Empty message invalid
  Maximum 5000 characters
  */

  return (
    value.length > 0 &&
    value.length <= 5000
  );
};

/*
----------------------------------------
OBJECT ID
----------------------------------------
*/

const mongoose = require(
  "mongoose"
);

const isValidObjectId = (
  id
) => {
  return mongoose.Types.ObjectId.isValid(
    id
  );
};

/*
----------------------------------------
FILE SIZE
----------------------------------------
*/

const isValidFileSize = (
  size,
  maxSizeMB = 20
) => {
  if (
    typeof size !== "number"
  ) {
    return false;
  }

  const maxBytes =
    maxSizeMB *
    1024 *
    1024;

  return size <= maxBytes;
};

/*
----------------------------------------
FILE TYPE
----------------------------------------
*/

const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",

  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "text/plain",

  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",

  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const isValidFileType = (
  mimeType
) => {
  return allowedFileTypes.includes(
    mimeType
  );
};

/*
========================================
EXPORT
========================================
*/

module.exports = {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidMessage,
  isValidObjectId,
  isValidFileSize,
  isValidFileType,
  allowedFileTypes,
};