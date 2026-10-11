import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import {
  updateProfile,
  changePassword,
  updateAvatar,
} from "../services/users";

const SettingsPage = () => {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    updateUser,
  } = useAuth();

  /*
  ==================================================
  PROFILE STATE
  ==================================================
  */

  const [username, setUsername] =
    useState(
      user?.username ||
        user?.name ||
        ""
    );

  const [email, setEmail] =
    useState(
      user?.email || ""
    );

  const [bio, setBio] =
    useState(
      user?.bio || ""
    );

  /*
  ==================================================
  AVATAR STATE
  ==================================================
  */

  const avatarPath =
    user?.avatar ||
    user?.profilePicture ||
    "";

  const avatar = 
  avatarPath 
  ? avatarPath.startsWith("http")
  ? avatarPath
  : `http://localhost:5000${avatarPath}`
  : "";  

  const [avatarPreview, setAvatarPreview] =
    useState(avatar);

  const [avatarLoading, setAvatarLoading] =
    useState(false);

  /*
  ==================================================
  PASSWORD STATE
  ==================================================
  */

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  /*
  ==================================================
  UI STATE
  ==================================================
  */

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /*
==================================================
DARK MODE
==================================================
*/

const [darkMode, setDarkMode] =
  useState(() => {
    return (
      localStorage.getItem(
        "chatkaro_dark_mode"
      ) === "true"
    );
  });

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
  ==================================================
  UPDATE LOCAL PREVIEW WHEN USER CHANGES
  ==================================================
  */

  useEffect(() => {
    const avatarPath =
      user?.avatar ||
        user?.profilePicture ||
        ""

        const avatarUrl = 
        avatarPath 
        ? avatarPath.startsWith("http")
        ? avatarPath
        : `http://localhost:5000${avatarPath}`
        : "";

        setAvatarPreview(
          avatarUrl
        );
  }, [
    user?.avatar,
    user?.profilePicture,
  ]);

  /*
  ==================================================
  AUTH CHECK
  ==================================================
  */

  if (
    !authLoading &&
    !isAuthenticated
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
  ==================================================
  AVATAR CHANGE
  ==================================================
  */

  const handleAvatarChange =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setSuccessMessage("");
      setErrorMessage("");

      /*
      ------------------------------
      FILE TYPE CHECK
      ------------------------------
      */

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        setErrorMessage(
          "Please select a valid image file."
        );

        event.target.value = "";
        return;
      }

      /*
      ------------------------------
      FILE SIZE CHECK
      ------------------------------
      */

      const maxSize =
        5 * 1024 * 1024;

      if (file.size > maxSize) {
        setErrorMessage(
          "Image size must be less than 5MB."
        );

        event.target.value = "";
        return;
      }

      /*
      ------------------------------
      LOCAL PREVIEW
      ------------------------------
      */

      const previewUrl =
        URL.createObjectURL(file);

      setAvatarPreview(
        previewUrl
      );

      /*
      ------------------------------
      UPLOAD
      ------------------------------
      */

      try {
        setAvatarLoading(true);

        const response =
          await updateAvatar(file);

        console.log(
          "AVATAR UPDATE RESPONSE:",
          response
        );

        const updatedUser =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          null;

        if (updatedUser) {
          updateUser(
            updatedUser
          );

          const updatedAvatarPath = 
            updatedUser.avatar ||
              updatedUser.profilePicture ||
              "";

          const updatedAvatar =
          updatedAvatarPath
          ? updatedAvatarPath.startsWith("http")
          ? updatedAvatarPath
          : `http://localhost:5000${updatedAvatarPath}`
          : previewUrl;

          setAvatarPreview(
            updatedAvatar
          );
        }

        setSuccessMessage(
          "Profile photo updated successfully."
        );
      } catch (error) {
        console.error(
          "AVATAR UPDATE ERROR:",
          error
        );

        /*
        ------------------------------
        RESTORE OLD AVATAR
        ------------------------------
        */

        setAvatarPreview(
          user?.avatar ||
            user?.profilePicture ||
            ""
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to update profile photo."
        );
      } finally {
        setAvatarLoading(false);

        event.target.value = "";

        URL.revokeObjectURL(
          previewUrl
        );
      }
    };

  /*
  ==================================================
  PROFILE UPDATE
  ==================================================
  */

  const handleProfileUpdate =
    async (event) => {
      event.preventDefault();

      setSuccessMessage("");
      setErrorMessage("");

      if (!username.trim()) {
        setErrorMessage(
          "Username is required."
        );

        return;
      }

      try {
        setProfileLoading(true);

        const response =
          await updateProfile({
            username:
              username.trim(),

            email:
              email.trim(),

            bio:
              bio.trim(),
          });

        const updatedUser =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          null;

        if (updatedUser) {
          updateUser(
            updatedUser
          );
        }

        setSuccessMessage(
          "Profile updated successfully."
        );
      } catch (error) {
        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to update profile."
        );
      } finally {
        setProfileLoading(false);
      }
    };

  /*
  ==================================================
  PASSWORD CHANGE
  ==================================================
  */

  const handlePasswordChange =
    async (event) => {
      event.preventDefault();

      setSuccessMessage("");
      setErrorMessage("");

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setErrorMessage(
          "Please fill all password fields."
        );

        return;
      }

      if (
        newPassword.length < 6
      ) {
        setErrorMessage(
          "New password must contain at least 6 characters."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setErrorMessage(
          "New passwords do not match."
        );

        return;
      }

      try {
        setPasswordLoading(true);

        await changePassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setSuccessMessage(
          "Password changed successfully."
        );
      } catch (error) {
        console.error(
          "PASSWORD CHANGE ERROR:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to change password."
        );
      } finally {
        setPasswordLoading(false);
      }
    };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (authLoading) {
    return (
      <div className="settings-loading">
        Loading settings...
      </div>
    );
  }

  /*
  ==================================================
  SETTINGS PAGE
  ==================================================
  */

  return (
    <div className="settings-page">
      <div className="settings-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="settings-header">
          <h1>
            Settings
          </h1>

          <p>
            Manage your ChatKaro
            account and preferences.
          </p>
        </div>

        {/* ======================================
            MESSAGES
        ====================================== */}

        {successMessage && (
          <div className="settings-success">
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="settings-error">
            ✕ {errorMessage}
          </div>
        )}

        {/* ======================================
            PROFILE SETTINGS
        ====================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <h2>
              👤 Profile
            </h2>

            <p>
              Update your profile
              information and photo.
            </p>
          </div>

          {/* ==================================
              PROFILE PHOTO
          ================================== */}

          <div className="settings-avatar-section">

            <div className="settings-avatar-wrapper">

              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={
                    username ||
                    "Profile"
                  }
                  className="settings-avatar"
                />
              ) : (
                <div className="settings-avatar settings-avatar-default">
                  {(username ||
                    "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {avatarLoading && (
                <div className="settings-avatar-loading">
                  Uploading...
                </div>
              )}
            </div>

            <div className="settings-avatar-content">

              <h3>
                Profile Photo
              </h3>

              <p>
                Choose a profile photo
                up to 5MB.
              </p>

              <label
                htmlFor="avatar-upload"
                className="settings-avatar-btn"
              >
                {avatarLoading
                  ? "Uploading..."
                  : "📷 Change Photo"}
              </label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={
                  handleAvatarChange
                }
                disabled={
                  avatarLoading
                }
                style={{
                  display: "none",
                }}
              />

            </div>
          </div>

          {/* ==================================
              PROFILE FORM
          ================================== */}

          <form
            onSubmit={
              handleProfileUpdate
            }
          >

            <div className="settings-field">

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Enter username"
              />

            </div>

            <div className="settings-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter email"
              />

            </div>

            <div className="settings-field">

              <label>
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(event) =>
                  setBio(
                    event.target.value
                  )
                }
                placeholder="Write something about yourself..."
                rows="4"
                maxLength="200"
              />

              <small>
                {bio.length}/200
              </small>

            </div>

            <button
              type="submit"
              className="settings-primary-btn"
              disabled={
                profileLoading
              }
            >
              {profileLoading
                ? "Saving..."
                : "Save Profile"}
            </button>

          </form>
        </section>

        {/* ======================================
            PASSWORD SETTINGS
        ====================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <h2>
              🔐 Security
            </h2>

            <p>
              Change your account
              password.
            </p>
          </div>

          <form
            onSubmit={
              handlePasswordChange
            }
          >

            <div className="settings-field">

              <label>
                Current Password
              </label>

              <input
                type="password"
                value={
                  currentPassword
                }
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                placeholder="Enter current password"
              />

            </div>

            <div className="settings-field">

              <label>
                New Password
              </label>

              <input
                type="password"
                value={
                  newPassword
                }
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                placeholder="Enter new password"
              />

            </div>

            <div className="settings-field">

              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Confirm new password"
              />

            </div>

            <button
              type="submit"
              className="settings-primary-btn"
              disabled={
                passwordLoading
              }
            >
              {passwordLoading
                ? "Changing..."
                : "Change Password"}
            </button>

          </form>
        </section>
        {/* ======================================
    APPEARANCE SETTINGS
====================================== */}

<section className="settings-card">

  <div className="settings-card-header">
    <h2>
      🎨 Appearance
    </h2>

    <p>
      Customize how ChatKaro looks.
    </p>
  </div>

  <div className="settings-appearance-row">

    <div className="settings-appearance-info">

      <div className="settings-appearance-icon">
        {darkMode ? "🌙" : "☀️"}
      </div>

      <div>
        <h3>
          Night Mode
        </h3>

        <p>
          {darkMode
            ? "Dark theme is currently enabled."
            : "Use the light theme."}
        </p>
      </div>

    </div>

    <button
      type="button"
      className={`theme-toggle ${
        darkMode
          ? "theme-toggle-active"
          : ""
      }`}
      onClick={() =>
        setDarkMode(
          (current) => !current
        )
      }
      aria-label="Toggle Night Mode"
    >
      <span className="theme-toggle-circle">
        {darkMode ? "🌙" : "☀️"}
      </span>
    </button>

  </div>

</section>
      </div>
    </div>
  );
};

export default SettingsPage;