
import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  MessageCircle,
  UserRound,
  Settings,
  Moon,
  Sun,
  Bell,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

const MobileNav = ({
  onClose,
  unreadCount = 0,
  notificationCount = 0,
  username = "Nikhil",
  isOnline = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains(
      "dark-mode"
    )
  );

  const isActive = (path) =>
    location.pathname === path;

  const handleLinkClick = () => {
    onClose?.();
  };

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    document.documentElement.classList.toggle(
      "dark-mode",
      nextMode
    );

    localStorage.setItem(
      "chatkaro-theme",
      nextMode ? "dark" : "light"
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("chatkaro_token");
    localStorage.removeItem("chatkaro_user");

    onClose?.();
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      label: "Chats",
      path: "/chat",
      icon: MessageCircle,
      badge: unreadCount,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: UserRound,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="mobile-nav">
      {/* Header */}
      <div className="mobile-nav-header">
        <Link
          to="/chat"
          onClick={handleLinkClick}
          className="mobile-nav-logo"
        >
          <span className="mobile-nav-logo-icon">
            C
          </span>

          <span>ChatKaro</span>
        </Link>

        {onClose && (
          <button
            type="button"
            className="mobile-nav-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="mobile-nav-user">
        <div className="mobile-nav-avatar">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="mobile-nav-user-info">
          <strong>{username}</strong>

          <span>
            <i
              className={
                isOnline
                  ? "mobile-online-dot"
                  : "mobile-offline-dot"
              }
            />
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <Link
          to="/profile"
          onClick={handleLinkClick}
          className="mobile-nav-profile-link"
          aria-label="View profile"
        >
          <ChevronRight size={19} />
        </Link>
      </div>

      {/* Navigation */}
      <p className="mobile-nav-section-title">
        MENU
      </p>

      <nav className="mobile-nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`mobile-nav-link ${
                isActive(item.path) ? "active" : ""
              }`}
            >
              <Icon size={20} />

              <span>{item.label}</span>

              {item.badge > 0 && (
                <span className="mobile-nav-badge">
                  {item.badge > 99
                    ? "99+"
                    : item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Notifications */}
        <Link
          to="/notifications"
          onClick={handleLinkClick}
          className={`mobile-nav-link ${
            isActive("/notifications") ? "active" : ""
          }`}
        >
          <Bell size={20} />

          <span>Notifications</span>

          {notificationCount > 0 && (
            <span className="mobile-nav-badge">
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Quick Actions */}
      <p className="mobile-nav-section-title">
        PREFERENCES
      </p>

      <button
        type="button"
        className="mobile-nav-action"
        onClick={toggleTheme}
      >
        {darkMode ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}

        <span>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </span>
      </button>

      <button
        type="button"
        className="mobile-nav-action mobile-nav-logout"
        onClick={handleLogout}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      <div className="mobile-nav-footer">
        <span>ChatKaro</span>
        <span>Connect. Chat. Stay Connected.</span>
      </div>
    </aside>
  );
};

export default MobileNav;

