import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Search,
  Bell,
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  ChevronDown,
  MessageCircle,
  CircleUserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { getAvatarUrl } from "../../utils/avatar";

const Header = ({
  user,
  onLogout,
  onSearch,
}) => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "chatkaro_dark_mode"
        ) === "true"
      );
    });

  const [showMenu, setShowMenu] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        icon: "💬",
        title: "New Message",
        text: "You received a new message.",
        time: "Just now",
      },
      {
        id: 2,
        icon: "👤",
        title: "New Connection",
        text: "Someone wants to chat with you.",
        time: "5 min ago",
      },
      {
        id: 3,
        icon: "❤️",
        title: "Welcome to ChatKaro",
        text: "Start chatting with your friends.",
        time: "Today",
      },
    ]);

  const menuRef = useRef(null);

  const notificationRef =
    useRef(null);

  /*
  ============================================
  DARK MODE
  ============================================
  */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark-mode"
      );

      localStorage.setItem(
        "chatkaro_dark_mode",
        "true"
      );
    } else {
      document.documentElement.classList.remove(
        "dark-mode"
      );

      localStorage.setItem(
        "chatkaro_dark_mode",
        "false"
      );
    }
  }, [darkMode]);

  /*
  ============================================
  CLOSE DROPDOWNS
  ============================================
  */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
  ============================================
  SEARCH
  ============================================
  */

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (onSearch) {
      onSearch(value.trim());
    }
  };

  /*
  ============================================
  LOGOUT
  ============================================
  */

  const handleLogout = () => {
    setShowMenu(false);

    if (onLogout) {
      onLogout();
    }
  };

  /*
  ============================================
  AVATAR
  ============================================
  */

  const avatarUrl = getAvatarUrl(
    user?.avatar ||
    user?.profilePicture ||
    ""
  );

  const username =
    user?.username ||
    user?.name ||
    "User";

  return (
    <header className="chatkaro-header">

      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div className="header-left">

        <div
          className="chatkaro-brand"
          onClick={() =>
            navigate("/chat")
          }
        >

          <div className="chatkaro-logo">
            <MessageCircle
              size={22}
              strokeWidth={2.5}
            />
          </div>

          <div className="chatkaro-brand-text">
            <h2>ChatKaro</h2>

            <span>
              Connect. Chat. Stay Connected.
            </span>
          </div>

        </div>

      </div>

      {/* ======================================
          CENTER SEARCH
      ====================================== */}

      <div className="header-search">

        <Search
          size={19}
          className="header-search-icon"
        />

        <input
          type="text"
          placeholder="Search people or messages..."
          value={search}
          onChange={handleSearch}
        />

        {search && (
          <button
            type="button"
            className="header-search-clear"
            onClick={() => {
              setSearch("");

              if (onSearch) {
                onSearch("");
              }
            }}
          >
            ×
          </button>
        )}

      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="header-right">

        {/* ==================================
    ONLINE USERS
================================== */}

        <div className="header-online-status">

          <span className="online-dot"></span>

          <span>
            Online
          </span>

        </div>


        {/* ==================================
    DARK MODE
================================== */}

        <button
          type="button"
          className="header-icon-button"
          title={
            darkMode
              ? "Light Mode"
              : "Night Mode"
          }
          onClick={() =>
            setDarkMode(
              (current) => !current
            )
          }
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>


        {/* ==================================
    NOTIFICATIONS
================================== */}

        <div
          className="header-dropdown-wrapper"
          ref={notificationRef}
        >

          {/* NOTIFICATION BUTTON */}

          <button
            type="button"
            className="header-icon-button notification-button"
            title="Notifications"
            onClick={() => {

              setShowNotifications(
                (current) => !current
              );

              setShowMenu(false);

            }}
          >

            <Bell size={20} />

            {/* NOTIFICATION COUNT */}

            {notifications.length > 0 && (
              <span className="notification-badge">

                {notifications.length > 9
                  ? "9+"
                  : notifications.length}

              </span>
            )}

          </button>


          {/* ==================================
      NOTIFICATION DROPDOWN
  ================================== */}

          {showNotifications && (

            <div className="notification-dropdown">

              {/* HEADER */}

              <div className="notification-header">

                <div>

                  <h3>
                    Notifications
                  </h3>

                  <span>

                    {notifications.length === 0
                      ? "You're all caught up"
                      : `You have ${notifications.length
                      } new ${notifications.length === 1
                        ? "notification"
                        : "notifications"
                      }`}

                  </span>

                </div>

                <Bell size={19} />

              </div>


              {/* ==================================
          NOTIFICATION LIST
      ================================== */}

              {notifications.length === 0 ? (

                /* EMPTY STATE */

                <div className="no-notifications">

                  <Bell size={28} />

                  <p>
                    No new notifications
                  </p>

                  <span>
                    You're all caught up 🎉
                  </span>

                </div>

              ) : (

                /* NOTIFICATION LIST */

                notifications.map(
                  (notification) => (

                    <div
                      className="notification-item"
                      key={notification.id}
                    >

                      <div className="notification-icon">
                        {notification.icon}
                      </div>

                      <div>

                        <strong>
                          {notification.title}
                        </strong>

                        <p>
                          {notification.text}
                        </p>

                        <small>
                          {notification.time}
                        </small>

                      </div>

                    </div>

                  )
                )

              )}


              {/* ==================================
          MARK ALL AS READ
      ================================== */}

              {notifications.length > 0 && (

                <button
                  type="button"
                  className="view-all-notifications"
                  onClick={() => {

                    setNotifications([]);

                    setShowNotifications(false);

                  }}
                >
                  Mark all as read
                </button>

              )}

            </div>

          )}

        </div>
        {/* ==================================
            PROFILE
        ================================== */}

        <div
          className="header-dropdown-wrapper"
          ref={menuRef}
        >

          <button
            type="button"
            className="header-profile-button"
            onClick={() => {
              setShowMenu(
                (current) => !current
              );

              setShowNotifications(false);
            }}
          >

            <div className="header-avatar-wrapper">

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="header-avatar"
                />
              ) : (
                <div className="header-avatar-default">
                  <User size={20} />
                </div>
              )}

              <span className="profile-online-dot"></span>

            </div>

            <div className="header-user-info">

              <strong>
                {username}
              </strong>

              <span>
                Online
              </span>

            </div>

            <ChevronDown
              size={17}
              className={
                showMenu
                  ? "profile-chevron-open"
                  : ""
              }
            />

          </button>

          {showMenu && (
            <div className="profile-dropdown">

              {/* PROFILE HEADER */}

              <div className="profile-dropdown-header">

                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={username}
                  />
                ) : (
                  <div className="profile-dropdown-avatar">
                    <CircleUserRound
                      size={27}
                    />
                  </div>
                )}

                <div>
                  <strong>
                    {username}
                  </strong>

                  <span>
                    🟢 Active now
                  </span>
                </div>

              </div>

              <div className="profile-dropdown-divider"></div>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/settings");
                }}
              >
                <User size={18} />

                <div>
                  <strong>
                    My Profile
                  </strong>

                  <span>
                    View your profile
                  </span>
                </div>
              </button>

              {/* SETTINGS */}

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/settings");
                }}
              >
                <Settings size={18} />

                <div>
                  <strong>
                    Settings
                  </strong>

                  <span>
                    Manage your account
                  </span>
                </div>
              </button>

              {/* THEME */}

              <button
                type="button"
                onClick={() =>
                  setDarkMode(
                    (current) => !current
                  )
                }
              >
                {darkMode ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}

                <div>
                  <strong>
                    {darkMode
                      ? "Light Mode"
                      : "Night Mode"}
                  </strong>

                  <span>
                    Change appearance
                  </span>
                </div>
              </button>

              <div className="profile-dropdown-divider"></div>

              {/* LOGOUT */}

              <button
                type="button"
                className="logout-menu-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />

                <div>
                  <strong>
                    Logout
                  </strong>

                  <span>
                    Sign out from ChatKaro
                  </span>
                </div>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};



export default Header;