import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MobileNav from "../components/layout/MobileNav";
import ChatWindow from "../components/chat/ChatWindow";

import { getAvatarUrl } from "../utils/avatar";

import CreateGroup from "../components/group/CreateGroups";
import GroupInfo from "../components/group/GroupInfo";
import GroupMembers from "../components/group/GroupMembers";
import GroupSettings from "../components/group/GroupsSettings";

import {
  getGroups,
  getGroupById,
  deleteGroup,
  removeGroupMember,
} from "../services/groups";

import useAuth from "../hooks/useAuth";

import {
  get,
  post,
  put,
  del,
} from "../services/api";

import {
  createPrivateConversation,
} from "../services/conversations";

const ChatPage = () => {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [conversationId, setConversationId] =
    useState(null);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [messageText, setMessageText] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

    const [showGroupMenu, setShowGroupMenu] = useState(false);

  /*
  ==========================================
  GROUP STATES
  ==========================================
  */

  const [groups, setGroups] =
    useState([]);

  const [loadingGroups, setLoadingGroups] =
    useState(false);

  const [showCreateGroup, setShowCreateGroup] =
    useState(false);

  const [groupView, setGroupView] =
    useState("chat");

  /*
  ==========================================
  LOAD USERS
  ==========================================
  */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const response =
          await get("/users");

        console.log(
          "USERS RESPONSE:",
          response.data
        );

        const userList =
          response.data?.users ||
          response.data?.data ||
          [];

        setUsers(
          Array.isArray(userList)
            ? userList.filter(
              (item) =>
                String(
                  item._id ||
                  item.id
                ) !==
                String(
                  user?._id ||
                  user?.id
                )
            )
            : []
        );
      } catch (error) {
        console.error(
          "LOAD USERS ERROR:",
          error
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user) {
      loadUsers();
    }
  }, [user]);

  /*
  ==========================================
  LOAD GROUPS
  ==========================================
  */

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoadingGroups(true);

        const response =
          await getGroups();

        const groupList =
          response?.groups ||
          response?.data?.groups ||
          [];

        setGroups(
          Array.isArray(groupList)
            ? groupList.filter(
              (group) =>
                group.isActive !== false
            )
            : []
        );
      } catch (error) {
        console.error(
          "LOAD GROUPS ERROR:",
          error
        );
      } finally {
        setLoadingGroups(false);
      }
    };

    if (user) {
      loadGroups();
    }
  }, [user]);

  /*
  ==========================================
  SELECT CHATKARO AI
  ==========================================
  */

  const handleSelectAI = () => {
    setSelectedUser({
      _id: "chatkaro-ai",
      id: "chatkaro-ai",
      username: "ChatKaro AI",
      name: "ChatKaro AI",
      isAI: true,
    });

    setConversationId(null);

    setMessages([]);

    setMessageText("");

    setGroupView("chat");

    setLoadingMessages(false);
  };

  /*
  ==========================================
  SELECT NORMAL USER
  ==========================================
  */

  const handleSelectUser = async (
    selected
  ) => {
    if (selected?.isAI) {
      handleSelectAI();
      return;
    }

    try {
      setLoadingMessages(true);

      setMessages([]);

      setConversationId(null);

      setGroupView("chat");

      const selectedUserId =
        selected?._id ||
        selected?.id;

      if (!selectedUserId) {
        throw new Error(
          "Selected user ID not found"
        );
      }

      let completeUser =
        selected;

      try {
        const userResponse =
          await get(
            `/users/${selectedUserId}`
          );

        completeUser =
          userResponse.data?.user ||
          userResponse.data?.data ||
          userResponse.data ||
          selected;
      } catch (profileError) {
        console.warn(
          "PROFILE FETCH FAILED:",
          profileError
        );

        completeUser =
          selected;
      }

      const avatarPath =
        completeUser?.avatar ||
        completeUser?.profilePicture ||
        "";

      const avatar =
        getAvatarUrl(
          avatarPath
        );

      const selectedWithAvatar = {
        ...completeUser,

        _id:
          completeUser?._id ||
          selectedUserId,

        id:
          completeUser?.id ||
          completeUser?._id ||
          selectedUserId,

        avatar,
      };

      setSelectedUser(
        selectedWithAvatar
      );

      const response =
        await createPrivateConversation(
          selectedUserId
        );

      const conversation =
        response?.conversation ||
        response?.data?.conversation ||
        response?.data;

      const id =
        conversation?._id ||
        conversation?.id;

      if (!id) {
        throw new Error(
          "Conversation ID not received"
        );
      }

      setConversationId(id);

      const messageResponse =
        await get(
          `/messages/${id}`
        );

      const messageList =
        messageResponse.data?.messages ||
        messageResponse.data?.data ||
        [];

      setMessages(
        Array.isArray(messageList)
          ? messageList
          : []
      );
    } catch (error) {
      console.error(
        "SELECT USER ERROR:",
        error
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  /*
  ==========================================
  SELECT GROUP
  ==========================================
  */

  const handleSelectGroup = async (
    groupItem
  ) => {
    try {
      setLoadingMessages(true);

      setMessages([]);

      setConversationId(null);

      setGroupView("chat");

      const groupId =
        groupItem?._id ||
        groupItem?.id;

      if (!groupId) {
        throw new Error(
          "Group ID not found"
        );
      }

      const response =
        await getGroupById(
          groupId
        );

      const group =
        response?.group ||
        response?.data?.group ||
        response?.data ||
        groupItem;

      const conversation =
        group?.conversation ||
        groupItem?.conversation;

      const id =
        conversation?._id ||
        conversation?.id ||
        group?.conversationId;

      if (!id) {
        throw new Error(
          "Group conversation ID not found"
        );
      }

      const groupAvatar =
        getAvatarUrl(
          group.avatar ||
          conversation?.groupAvatar ||
          ""
        );

      const selectedGroup = {
        ...group,

        _id: groupId,

        id: groupId,

        username:
          group.name ||
          groupItem.name ||
          "Group",

        name:
          group.name ||
          groupItem.name ||
          "Group",

        avatar:
          groupAvatar,

        isGroup: true,
      };

      setSelectedUser(
        selectedGroup
      );

      setConversationId(id);

      setMessageText("");

      setShowCreateGroup(false);

      const messageResponse =
        await get(
          `/messages/${id}`
        );

      const messageList =
        messageResponse.data?.messages ||
        messageResponse.data?.data ||
        [];

      setMessages(
        Array.isArray(messageList)
          ? messageList
          : []
      );
    } catch (error) {
      console.error(
        "SELECT GROUP ERROR:",
        error
      );

      console.error(
        "GROUP ERROR RESPONSE:",
        error?.response?.data
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  /*
  ==========================================
  GROUP CREATED
  ==========================================
  */

  const handleGroupCreated = (
    newGroup
  ) => {
    if (!newGroup) {
      console.warn(
        "Group created, but group data was not returned."
      );

      return;
    }

    setGroups(
      (previous) => {
        const groupId =
          String(
            newGroup._id ||
            newGroup.id
          );

        const exists =
          previous.some(
            (group) =>
              String(
                group._id ||
                group.id
              ) === groupId
          );

        if (exists) {
          return previous.map(
            (group) =>
              String(
                group._id ||
                group.id
              ) === groupId
                ? newGroup
                : group
          );
        }

        return [
          newGroup,
          ...previous,
        ];
      }
    );

    setShowCreateGroup(false);

    handleSelectGroup(
      newGroup
    );
  };

  /*
  ==========================================
  GROUP UPDATED
  ==========================================
  */

  const handleGroupUpdated = (
    updatedGroup
  ) => {
    if (!updatedGroup) {
      return;
    }

    setSelectedUser(
      (previous) => ({
        ...previous,
        ...updatedGroup,

        isGroup: true,

        _id:
          updatedGroup._id ||
          previous?._id,

        id:
          updatedGroup._id ||
          previous?.id,

        name:
          updatedGroup.name ||
          previous?.name,

        username:
          updatedGroup.name ||
          previous?.username,

        avatar:
          getAvatarUrl(
            updatedGroup.avatar ||
            ""
          ),
      })
    );

    setGroups(
      (previous) =>
        previous.map(
          (group) =>
            String(
              group._id ||
              group.id
            ) ===
              String(
                updatedGroup._id
              )
              ? updatedGroup
              : group
        )
    );

    setGroupView("chat");
  };

  /*
  ==========================================
  DELETE GROUP
  ==========================================
  */

  const handleDeleteGroup = async (
    groupId
  ) => {
    if (!groupId) {
      return;
    }

    try {
      await deleteGroup(
        groupId
      );

      setGroups(
        (previous) =>
          previous.filter(
            (group) =>
              String(
                group._id ||
                group.id
              ) !==
              String(groupId)
          )
      );

      setSelectedUser(null);

      setConversationId(null);

      setMessages([]);

      setGroupView("chat");
    } catch (error) {
      console.error(
        "DELETE GROUP ERROR:",
        error
      );

      throw error;
    }
  };

  /*
  ==========================================
  REMOVE GROUP MEMBER
  ==========================================
  */

  const handleRemoveGroupMember =
    async (member) => {
      if (
        !selectedUser?.isGroup
      ) {
        return;
      }

      const memberId =
        member?.user?._id ||
        member?.user?.id ||
        member?._id ||
        member?.id;

      if (!memberId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to remove this member?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await removeGroupMember(
          selectedUser._id ||
          selectedUser.id,
          memberId
        );

        const response =
          await getGroupById(
            selectedUser._id ||
            selectedUser.id
          );

        const updatedGroup =
          response?.group ||
          response?.data?.group ||
          response?.data;

        if (updatedGroup) {
          handleGroupUpdated(
            updatedGroup
          );

          setGroupView(
            "members"
          );
        }
      } catch (error) {
        console.error(
          "REMOVE GROUP MEMBER ERROR:",
          error
        );
      }
    };

  /*
  ==========================================
  SELECT GROUP MEMBER
  ==========================================
  */

  const handleSelectGroupMember =
    (member) => {
      const memberUser =
        member?.user ||
        member;

      if (!memberUser) {
        return;
      }

      handleSelectUser(
        memberUser
      );
    };

  /*
  ==========================================
  SEND MESSAGE
  ==========================================
  */

  const handleSendMessage = async ({
    content,
    file,
  }) => {
    if (selectedUser?.isAI) {
      if (content?.trim()) {
        await handleAskAI(
          content.trim()
        );
      }

      return;
    }

    if (
      !conversationId ||
      (!content?.trim() && !file)
    ) {
      return;
    }

    try {
      let uploadedFile = null;

      if (file) {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const uploadResponse =
          await post(
            "/upload",
            formData
          );

        uploadedFile =
          uploadResponse.data?.file;

        if (
          !uploadedFile?.url
        ) {
          throw new Error(
            "File upload failed"
          );
        }
      }

      let messageType =
        "text";

      if (uploadedFile) {
        const mimeType =
          uploadedFile.mimetype ||
          uploadedFile.mimeType ||
          "";

        if (
          mimeType.startsWith(
            "image/"
          )
        ) {
          messageType =
            "image";
        } else {
          messageType =
            "file";
        }
      }

      const messageData = {
        conversationId,

        content:
          content?.trim() ||
          "",

        type:
          messageType,
      };

      if (uploadedFile) {
        messageData.file = {
          url:
            uploadedFile.url,

          filename:
            uploadedFile.filename ||
            "",

          originalName:
            uploadedFile.originalName ||
            uploadedFile.originalname ||
            "",

          mimeType:
            uploadedFile.mimetype ||
            uploadedFile.mimeType ||
            "",

          size:
            Number(
              uploadedFile.size
            ) || 0,
        };
      }

      const response =
        await post(
          "/messages",
          messageData
        );

      const newMessage =
        response.data?.data ||
        response.data?.message;

      if (newMessage) {
        setMessages(
          (previous) => [
            ...previous,
            newMessage,
          ]
        );
      }

      setMessageText("");
    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error?.response?.data
      );
    }
  };

  /*
  ==========================================
  AI
  ==========================================
  */

  const handleAskAI = async (
    question
  ) => {
    if (!question?.trim()) {
      return;
    }

    const userQuestion =
      question.trim();

    const userAIMessageId =
      `user-ai-${Date.now()}`;

    const userAIMessage = {
      _id:
        userAIMessageId,

      id:
        userAIMessageId,

      content:
        userQuestion,

      text:
        userQuestion,

      type:
        "text",

      sender: {
        _id:
          user?._id ||
          user?.id,

        id:
          user?._id ||
          user?.id,

        username:
          user?.username ||
          user?.name ||
          "You",

        name:
          user?.username ||
          user?.name ||
          "You",
      },

      createdAt:
        new Date().toISOString(),

      aiUserMessage:
        true,
    };

    setMessages(
      (previous) => [
        ...previous,
        userAIMessage,
      ]
    );

    setMessageText("");

    try {
      setAiLoading(true);

      const response =
        await post(
          "/ai",
          {
            message:
              userQuestion,
          }
        );

      const aiReply =
        response.data?.reply;

      if (!aiReply) {
        throw new Error(
          "AI reply not received"
        );
      }

      const aiMessageId =
        `ai-${Date.now()}`;

      const aiMessage = {
        _id:
          aiMessageId,

        id:
          aiMessageId,

        content:
          aiReply,

        text:
          aiReply,

        type:
          "text",

        sender: {
          _id:
            "chatkaro-ai",

          id:
            "chatkaro-ai",

          username:
            "ChatKaro AI",

          name:
            "ChatKaro AI",
        },

        createdAt:
          new Date().toISOString(),

        aiGenerated:
          true,

        aiModel:
          response.data?.aiModel ||
          "qwen2.5:3b",
      };

      setMessages(
        (previous) => [
          ...previous,
          aiMessage,
        ]
      );
    } catch (error) {
      console.error(
        "ASK AI ERROR:",
        error
      );

      const errorMessage =
        error?.response?.data
          ?.message ||
        error?.message ||
        "AI is temporarily unavailable.";

      const aiErrorId =
        `ai-error-${Date.now()}`;

      const errorChatMessage = {
        _id:
          aiErrorId,

        id:
          aiErrorId,

        content:
          `Sorry, ${errorMessage}`,

        text:
          `Sorry, ${errorMessage}`,

        type:
          "text",

        sender: {
          _id:
            "chatkaro-ai",

          id:
            "chatkaro-ai",

          username:
            "ChatKaro AI",

          name:
            "ChatKaro AI",
        },

        createdAt:
          new Date().toISOString(),

        aiGenerated:
          true,

        aiError:
          true,
      };

      setMessages(
        (previous) => [
          ...previous,
          errorChatMessage,
        ]
      );
    } finally {
      setAiLoading(false);
    }
  };

  /*
  ==========================================
  REACTION
  ==========================================
  */

  const handleReaction = async (
    messageId,
    emoji
  ) => {
    const aiMessage =
      messages.find(
        (message) =>
          String(
            message?._id ||
            message?.id
          ) ===
          String(messageId)
      );

    if (
      aiMessage?.aiGenerated
    ) {
      return;
    }

    try {
      const response =
        await post(
          `/messages/${messageId}/reaction`,
          {
            emoji,
          }
        );

      const updatedMessage =
        response.data?.data;

      if (
        updatedMessage
      ) {
        setMessages(
          (previous) =>
            previous.map(
              (message) => {
                const id =
                  message?._id ||
                  message?.id;

                if (
                  String(id) !==
                  String(messageId)
                ) {
                  return message;
                }

                return updatedMessage;
              }
            )
        );
      }
    } catch (error) {
      console.error(
        "REACTION ERROR:",
        error
      );
    }
  };

  /*
  ==========================================
  MARK READ
  ==========================================
  */

  const markMessageAsRead =
    async (
      messageId
    ) => {
      try {
        await put(
          `/messages/${messageId}/read`
        );
      } catch (error) {
        console.error(
          "MARK READ ERROR:",
          error
        );
      }
    };

  useEffect(() => {
    if (
      selectedUser?.isAI
    ) {
      return;
    }

    if (
      !messages.length ||
      !user
    ) {
      return;
    }

    const currentUserId =
      user?._id ||
      user?.id;

    messages.forEach(
      (message) => {
        const senderId =
          message?.sender?._id ||
          message?.sender?.id ||
          message?.senderId;

        if (
          String(senderId) ===
          String(currentUserId)
        ) {
          return;
        }

        const alreadyRead =
          message?.readBy?.some(
            (item) =>
              String(
                item?.user?._id ||
                item?.user
              ) ===
              String(
                currentUserId
              )
          );

        if (
          !alreadyRead
        ) {
          markMessageAsRead(
            message?._id ||
            message?.id
          );
        }
      }
    );
  }, [
    messages,
    user,
    selectedUser,
  ]);

  /*
  ==========================================
  REPLY
  ==========================================
  */

  const handleReply = (
    message
  ) => {
    console.log(
      "REPLY MESSAGE:",
      message
    );
  };

  /*
  ==========================================
  EDIT
  ==========================================
  */

  const handleEdit = async (
    message
  ) => {
    if (
      message?.aiGenerated
    ) {
      return;
    }

    const newContent =
      window.prompt(
        "Edit message:",
        message?.content ||
        ""
      );

    if (
      !newContent?.trim()
    ) {
      return;
    }

    try {
      const messageId =
        message?._id ||
        message?.id;

      const response =
        await put(
          `/messages/${messageId}`,
          {
            content:
              newContent.trim(),
          }
        );

      const updatedMessage =
        response.data?.data;

      if (
        updatedMessage
      ) {
        setMessages(
          (previous) =>
            previous.map(
              (item) => {
                const id =
                  item?._id ||
                  item?.id;

                return String(
                  id
                ) ===
                  String(
                    messageId
                  )
                  ? updatedMessage
                  : item;
              }
            )
        );
      }
    } catch (error) {
      console.error(
        "EDIT ERROR:",
        error
      );
    }
  };

  /*
  ==========================================
  DELETE MESSAGE
  ==========================================
  */

  const handleDelete = async (
    messageId
  ) => {
    const message =
      messages.find(
        (item) =>
          String(
            item?._id ||
            item?.id
          ) ===
          String(messageId)
      );

    if (
      message?.aiGenerated
    ) {
      setMessages(
        (previous) =>
          previous.filter(
            (item) =>
              String(
                item?._id ||
                item?.id
              ) !==
              String(messageId)
          )
      );

      return;
    }

    try {
      await del(
        `/messages/${messageId}`
      );

      setMessages(
        (previous) =>
          previous.map(
            (message) => {
              const id =
                message?._id ||
                message?.id;

              if (
                String(id) !==
                String(messageId)
              ) {
                return message;
              }

              return {
                ...message,

                deleted:
                  true,

                content:
                  "This message was deleted",
              };
            }
          )
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );
    }
  };

  /*
  ==========================================
  TYPING
  ==========================================
  */

  const handleTyping = () => {
    console.log(
      "Typing..."
    );
  };

  const handleStopTyping =
    () => {
      console.log(
        "Stopped typing"
      );
    };

  /*
  ==========================================
  FILTER USERS
  ==========================================
  */

  const filteredUsers =
    users.filter((item) => {
      const query =
        searchQuery
          .toLowerCase()
          .trim();

      if (!query) {
        return true;
      }

      const username =
        item?.username ||
        item?.name ||
        "";

      const email =
        item?.email ||
        "";

      return (
        username
          .toLowerCase()
          .includes(query) ||
        email
          .toLowerCase()
          .includes(query)
      );
    });

  /*
  ==========================================
  GROUP MEMBERS NORMALIZE
  ==========================================
  */

  const groupMembers =
    selectedUser?.isGroup
      ? (
        selectedUser.members ||
        []
      ).map(
        (member) => ({
          ...member,

          _id:
            member?.user?._id ||
            member?.user?.id ||
            member?._id ||
            member?.id,

          id:
            member?.user?._id ||
            member?.user?.id ||
            member?._id ||
            member?.id,

          username:
            member?.user?.username ||
            member?.username ||
            member?.user?.name ||
            member?.name ||
            "User",

          name:
            member?.user?.name ||
            member?.user?.username ||
            member?.name ||
            member?.username ||
            "User",

          avatar:
            getAvatarUrl(
              member?.user?.avatar ||
              member?.user?.profilePicture ||
              member?.avatar ||
              ""
            ),
        })
      )
      : [];

  /*
  ==========================================
  UI
  ==========================================
  */

  return (
    <div className="chat-page">

      <Sidebar />

      {mobileMenuOpen && (
        <MobileNav
          onClose={() =>
            setMobileMenuOpen(
              false
            )
          }
        />
      )}

      <div className="chat-page-main">

        <Header
          onMenuClick={() =>
            setMobileMenuOpen(
              true
            )
          }
          title="ChatKaro"
          user={user}
          onSearch={setSearchQuery}
        />

        <main className="chat-page-content">

          {/* =================================
              LEFT USERS / GROUPS
          ================================= */}

          <div className="chat-users-list">

            <div className="chat-users-title">
              <h2>
                Chats
              </h2>
            </div>

            {/* GROUPS */}

            <div className="chat-users-title group-section-title">

              <h2>
                Groups
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCreateGroup(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showCreateGroup
                  ? "Cancel"
                  : "+ Create Group"}
              </button>

            </div>

            {showCreateGroup && (
              <CreateGroup
                onSuccess={
                  handleGroupCreated
                }
                onCancel={() =>
                  setShowCreateGroup(
                    false
                  )
                }
              />
            )}

            {loadingGroups ? (
              <p>
                Loading groups...
              </p>
            ) : groups.length ===
              0 ? (
              <p className="groups-empty">
                No groups yet. Create
                your first group!
              </p>
            ) : (
              groups
                .filter(
                  (group) =>
                    (
                      group.name ||
                      ""
                    )
                      .toLowerCase()
                      .includes(
                        searchQuery
                          .toLowerCase()
                          .trim()
                      )
                )
                .map(
                  (group) => {
                    const groupId =
                      group._id ||
                      group.id;

                    const active =
                      selectedUser?.isGroup &&
                      String(
                        selectedUser._id ||
                        selectedUser.id
                      ) ===
                      String(
                        groupId
                      );

                    return (
                      <button
                        key={
                          groupId
                        }
                        type="button"
                        className={`chat-user-item ${active
                            ? "active"
                            : ""
                          }`}
                        onClick={() =>
                          handleSelectGroup(
                            group
                          )
                        }
                      >

                        <div className="chat-user-avatar chat-user-avatar-default">
                          {(
                            group.name ||
                            "G"
                          )
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div className="chat-user-info">

                          <strong>
                            {group.name ||
                              "Unnamed Group"}
                          </strong>

                          <span>
                            {group.members
                              ?.length ||
                              0}{" "}
                            members
                          </span>

                        </div>

                      </button>
                    );
                  }
                )
            )}

            {/* AI */}

            <button
              type="button"
              className={`chat-user-item chatkaro-ai-item ${selectedUser?.isAI
                  ? "active"
                  : ""
                }`}
              onClick={
                handleSelectAI
              }
            >

              <div className="chat-user-avatar chat-ai-avatar">
                🤖
              </div>

              <div className="chat-user-info">

                <strong>
                  ChatKaro AI
                </strong>

                <span>
                  Ask anything
                </span>

              </div>

            </button>

            {/* NORMAL USERS */}

            {loadingUsers ? (
              <p>
                Loading users...
              </p>
            ) : users.length ===
              0 ? (
              <p>
                No other users found.
              </p>
            ) : filteredUsers.length ===
              0 ? (
              <p>
                No users found for "
                {searchQuery}"
              </p>
            ) : (
              filteredUsers.map(
                (item) => {
                  const id =
                    item._id ||
                    item.id;

                  const username =
                    item.username ||
                    item.name ||
                    "User";

                  const avatarPath =
                    item.avatar ||
                    item.profilePicture ||
                    "";

                  const avatar =
                    getAvatarUrl(
                      avatarPath
                    );

                  const active =
                    String(
                      selectedUser?._id ||
                      selectedUser?.id
                    ) ===
                    String(id) &&
                    !selectedUser?.isAI &&
                    !selectedUser?.isGroup;

                  return (
                    <button
                      key={id}
                      type="button"
                      className={`chat-user-item ${active
                          ? "active"
                          : ""
                        }`}
                      onClick={() =>
                        handleSelectUser(
                          item
                        )
                      }
                    >

                      {avatar ? (
                        <img
                          src={
                            avatar
                          }
                          alt={
                            item.username
                          }
                          className="chat-user-avatar"
                        />
                      ) : (
                        <div className="chat-user-avatar chat-user-avatar-default">
                          {(
                            username ||
                            "U"
                          )
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="chat-user-info">

                        <strong>
                          {
                            item.username
                          }
                        </strong>

                        <span>
                          Online
                        </span>

                      </div>

                    </button>
                  );
                }
              )
            )}

          </div>

          {/* =================================
              RIGHT SIDE
          ================================= */}

          <div className="chat-main-window">

           





            {/* =================================
                GROUP INFO
            ================================= */}

            {selectedUser?.isGroup &&
              groupView ===
              "info" ? (
              <GroupInfo
                group={
                  selectedUser
                }
                onClose={() =>
                  setGroupView(
                    "chat"
                  )
                }
              />
            ) : selectedUser?.isGroup &&
              groupView ===
              "members" ? (
              <GroupMembers
                members={
                  groupMembers
                }
                currentUser={
                  user
                }
                onRemove={
                  handleRemoveGroupMember
                }
                onSelect={
                  handleSelectGroupMember
                }
              />
            ) : selectedUser?.isGroup &&
              groupView ===
              "settings" ? (
              <GroupSettings
                group={
                  selectedUser
                }
                onSuccess={
                  handleGroupUpdated
                }
                onDelete={
                  handleDeleteGroup
                }
              />


            ) : (
              <ChatWindow
                selectedUser={
                  selectedUser
                }

                messages={
                  messages
                }

                currentUser={
                  user
                }

                messageText={
                  messageText
                }

                setMessageText={
                  setMessageText
                }

                onSendMessage={
                  handleSendMessage
                }

                onTyping={
                  handleTyping
                }

                onStopTyping={
                  handleStopTyping
                }

                onReply={
                  handleReply
                }

                onEdit={
                  handleEdit
                }

                onDelete={
                  handleDelete
                }

                onReaction={
                  handleReaction
                }

                typingUser={
                  null
                }

                loading={
                  loadingMessages ||
                  aiLoading
                }

                onAskAI={
                  handleAskAI
                }

                aiLoading={
                  aiLoading
                }

                groupView={groupView}
                onGroupViewChange={setGroupView}

                
              />
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default ChatPage;