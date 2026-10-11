export const getAvatarUrl = (
  avatar
) => {
  if (!avatar) {
    return "";
  }

  if (
    avatar.startsWith("http")
  ) {
    return avatar;
  }

  return `http://localhost:5000${avatar}`;
};