import React, { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth";
import { updateProfile } from "../../services/users";

const EditProfile = ({
  onSuccess,
  onCancel,
}) => {
  const {
    user,
    updateUser,
  } = useAuth();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    setUsername(
      user?.username ||
        user?.name ||
        ""
    );

    setEmail(
      user?.email || ""
    );

    setBio(
      user?.bio || ""
    );
  }, [user]);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    try {
      setLoading(true);

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
        updateUser?.(
          updatedUser
        );
      }

      setSuccess(
        "Profile updated successfully."
      );

      onSuccess?.(
        updatedUser
      );
    } catch (err) {
      console.error(
        "EDIT PROFILE ERROR:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile">

      <div className="edit-profile-header">
        <h2>
          Edit Profile
        </h2>

        <p>
          Update your ChatKaro
          profile information.
        </p>
      </div>

      {error && (
        <div className="edit-profile-error">
          ✕ {error}
        </div>
      )}

      {success && (
        <div className="edit-profile-success">
          ✓ {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="edit-profile-form"
      >
        <div className="edit-profile-field">
          <label htmlFor="profile-username">
            Username
          </label>

          <input
            id="profile-username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }
            placeholder="Enter username"
            disabled={loading}
          />
        </div>

        <div className="edit-profile-field">
          <label htmlFor="profile-email">
            Email
          </label>

          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="Enter email"
            disabled={loading}
          />
        </div>

        <div className="edit-profile-field">
          <label htmlFor="profile-bio">
            Bio
          </label>

          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) =>
              setBio(
                event.target.value
              )
            }
            placeholder="Write something about yourself..."
            rows="4"
            maxLength="200"
            disabled={loading}
          />

          <small>
            {bio.length}/200
          </small>
        </div>

        <div className="edit-profile-actions">

          {onCancel && (
            <button
              type="button"
              className="edit-profile-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="edit-profile-save"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default EditProfile;