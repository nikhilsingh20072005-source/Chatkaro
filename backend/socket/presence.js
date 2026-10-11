const onlineUsers = new Map();

/*
==================================================
USER ONLINE
==================================================
*/

function userOnline(userId, socketId) {
  if (!userId || !socketId) {
    return;
  }

  const id = String(userId);

  if (!onlineUsers.has(id)) {
    onlineUsers.set(id, new Set());
  }

  onlineUsers
    .get(id)
    .add(socketId);
}

/*
==================================================
USER OFFLINE
==================================================
*/

function userOffline(
  userId,
  socketId
) {
  if (!userId) {
    return false;
  }

  const id = String(userId);

  const sockets =
    onlineUsers.get(id);

  if (!sockets) {
    return false;
  }

  if (socketId) {
    sockets.delete(socketId);
  }

  /*
  User ke koi socket connection
  nahi bache to offline
  */

  if (sockets.size === 0) {
    onlineUsers.delete(id);
    return true;
  }

  return false;
}

/*
==================================================
CHECK USER ONLINE
==================================================
*/

function isUserOnline(userId) {
  if (!userId) {
    return false;
  }

  return onlineUsers.has(
    String(userId)
  );
}

/*
==================================================
GET ONLINE USER IDS
==================================================
*/

function getOnlineUsers() {
  return Array.from(
    onlineUsers.keys()
  );
}

/*
==================================================
GET USER SOCKETS
==================================================
*/

function getUserSockets(userId) {
  if (!userId) {
    return [];
  }

  const sockets =
    onlineUsers.get(
      String(userId)
    );

  if (!sockets) {
    return [];
  }

  return Array.from(sockets);
}

/*
==================================================
GET ONLINE USERS COUNT
==================================================
*/

function getOnlineUsersCount() {
  return onlineUsers.size;
}

module.exports = {
  userOnline,
  userOffline,
  isUserOnline,
  getOnlineUsers,
  getUserSockets,
  getOnlineUsersCount,
};