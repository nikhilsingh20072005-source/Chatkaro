
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageCircle,
  UserRound,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const username =
    user?.username || user?.name || "User";

  const avatarPath =
    user?.avatar || user?.profilePicture || "";

  const avatar = avatarPath
    ? avatarPath.startsWith("http")
      ? avatarPath
      : `http://localhost:5000${avatarPath}`
    : "";

  const navigation = [
    {
      label: "Chats",
      path: "/chat",
      icon: MessageCircle,
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

  const isActive = (path) => {
    if (path === "/chat") {
      return location.pathname === "/chat";
    }

    return location.pathname === path ||
      location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      window.alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <Link to="/chat" className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <MessageCircle size={23} strokeWidth={2.4} />
        </div>

        <div className="sidebar-brand-text">
          <strong>ChatKaro</strong>
          <span>Stay connected</span>
        </div>
      </Link>

      {/* Workspace */}
      <div className="sidebar-workspace">
        <div className="sidebar-workspace-icon">
          <Sparkles size={17} />
        </div>

        <div className="sidebar-workspace-info">
          <strong>My Workspace</strong>
          <span>Personal account</span>
        </div>

        <ChevronRight size={16} className="sidebar-chevron" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        <span className="sidebar-section-label">
          WORKSPACE
        </span>

        {navigation.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);

          return (
            <Link
              key={path}
              to={path}
              className={`sidebar-nav-item ${
                active ? "active" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={19} strokeWidth={1.9} />

              <span>{label}</span>

              {active && (
                <span className="sidebar-active-indicator" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user profile */}
      <div className="sidebar-bottom">
        <div className="sidebar-status-card">
          <span className="sidebar-status-dot" />

          <div>
            <strong>You're online</strong>
            <span>Ready to connect</span>
          </div>
        </div>

        <div className="sidebar-user">
          <Link
            to="/profile"
            className="sidebar-user-info"
            title="Open profile"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="sidebar-avatar"
              />
            ) : (
              <div className="sidebar-avatar sidebar-avatar-default">
                {username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="sidebar-user-details">
              <strong>{username}</strong>
              <span>{user?.email || "ChatKaro member"}</span>
            </div>
          </Link>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
