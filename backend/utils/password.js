const bcrypt = require("bcryptjs");

/*
========================================
HASH PASSWORD
========================================
*/

const hashPassword = async (
  password
) => {
  if (!password) {
    throw new Error(
      "Password is required"
    );
  }

  const salt =
    await bcrypt.genSalt(10);

  return await bcrypt.hash(
    password,
    salt
  );
};

/*
========================================
COMPARE PASSWORD
========================================
*/

const comparePassword = async (
  password,
  hashedPassword
) => {
  if (
    !password ||
    !hashedPassword
  ) {
    return false;
  }

  return await bcrypt.compare(
    password,
    hashedPassword
  );
};

/*
========================================
EXPORT
========================================
*/

module.exports = {
  hashPassword,
  comparePassword,
};