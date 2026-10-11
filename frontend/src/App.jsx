import React from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AuthContextProvider from "./context/AuthContext";
import ChatContextProvider from "./context/ChatContext";
import ThemeContextProvider from "./context/ThemeContext";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

/*
==================================================
GLOBAL CSS
==================================================
*/

import "./App.css";

import "./styles/Home.css";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/header.css";
import "./styles/chat.css";
import "./styles/messages.css";
import "./styles/profile.css";
import "./styles/settings.css";
import "./styles/auth.css";
import "./styles/modal.css";
import "./styles/responsive.css";
import "./styles/dark-mode.css";
import "./styles/groups.css";
import "./styles/CreateGroups.css";
import "./styles/ChatPage.css";
import "./styles/GroupInfo.css";
import "./styles/GroupMembers.css";
import "./styles/GroupSettings.css";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeContextProvider>

        <AuthContextProvider>

          <ChatContextProvider>

            <Routes>

              {/* HOME */}
              <Route
                path="/"
                element={<Home />}
              />

              {/* LOGIN */}
              <Route
                path="/login"
                element={<LoginPage />}
              />

              {/* SIGNUP */}
              <Route
                path="/signup"
                element={<SignupPage />}
              />

              {/* CHAT */}
              <Route
                path="/chat"
                element={<ChatPage />}
              />

              {/* PROFILE */}
              <Route
                path="/profile"
                element={<ProfilePage />}
              />

              {/* SETTINGS */}
              <Route
                path="/settings"
                element={<SettingsPage />}
              />

              {/* UNKNOWN URL */}
              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

          </ChatContextProvider>

        </AuthContextProvider>

      </ThemeContextProvider>
    </BrowserRouter>
  );
};

export default App;