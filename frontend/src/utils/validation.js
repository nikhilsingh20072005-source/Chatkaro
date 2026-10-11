export const isRequired = (
  value
) => {
  return (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  );
};

export const isValidEmail = (
  email
) => {
  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};

export const isValidPassword = (
  password
) => {
  return (
    typeof password ===
      "string" &&
    password.length >= 6
  );
};

export const passwordsMatch = (
  password,
  confirmPassword
) => {
  return (
    password ===
    confirmPassword
  );
};

export const isValidUsername = (
  username
) => {
  if (!username) {
    return false;
  }

  return (
    /^[a-zA-Z0-9_]{3,30}$/.test(
      username.trim()
    )
  );
};

export const isValidMessage = (
  message
) => {
  return (
    typeof message ===
      "string" &&
    message.trim().length > 0
  );
};

export const validateLogin = ({
  email,
  password,
}) => {
  const errors = {};

  if (!isRequired(email)) {
    errors.email =
      "Email is required.";
  } else if (
    !isValidEmail(email)
  ) {
    errors.email =
      "Please enter a valid email.";
  }

  if (!isRequired(password)) {
    errors.password =
      "Password is required.";
  }

  return errors;
};

export const validateSignup = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (!isRequired(username)) {
    errors.username =
      "Username is required.";
  } else if (
    !isValidUsername(username)
  ) {
    errors.username =
      "Username must be 3-30 characters.";
  }

  if (!isRequired(email)) {
    errors.email =
      "Email is required.";
  } else if (
    !isValidEmail(email)
  ) {
    errors.email =
      "Please enter a valid email.";
  }

  if (!isRequired(password)) {
    errors.password =
      "Password is required.";
  } else if (
    !isValidPassword(password)
  ) {
    errors.password =
      "Password must be at least 6 characters.";
  }

  if (
    !passwordsMatch(
      password,
      confirmPassword
    )
  ) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  return errors;
};

export default {
  isRequired,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  isValidUsername,
  isValidMessage,
  validateLogin,
  validateSignup,
};