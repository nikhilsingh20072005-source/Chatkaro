import React, { useState } from "react";

import { updateGroup } from "../../services/groups";

const GroupSettings = ({
  group,
  onSuccess,
  onDelete,
}) => {
  const [name, setName] =
    useState(
      group?.name ||
        group?.title ||
        ""
    );

  const [description, setDescription] =
    useState(
      group?.description ||
        ""
    );

  const [loading, setLoading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  if (!group) {
    return (
      <div className="group-settings-empty">
        <p>
          Group information is
          not available.
        </p>
      </div>
    );
  }

  const groupId =
    group._id || group.id;

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError(
        "Group name is required."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await updateGroup(
          groupId,
          {
            name: name.trim(),
            description:
              description.trim(),
          }
        );

      const updatedGroup =
        response?.group ||
        response?.data?.group ||
        response?.data ||
        null;

      setSuccess(
        "Group settings updated successfully."
      );

      onSuccess?.(
        updatedGroup
      );
    } catch (err) {
      console.error(
        "UPDATE GROUP ERROR:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to update group."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this group?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await onDelete?.(
        groupId
      );
    } catch (err) {
      console.error(
        "DELETE GROUP ERROR:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to delete group."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group-settings">

      <div className="group-settings-header">
        <h2>
          Group Settings
        </h2>

        <p>
          Manage your group
          information.
        </p>
      </div>

      {error && (
        <div className="group-settings-error">
          ✕ {error}
        </div>
      )}

      {success && (
        <div className="group-settings-success">
          ✓ {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="group-settings-form"
      >
        <div className="group-settings-field">
          <label htmlFor="group-settings-name">
            Group Name
          </label>

          <input
            id="group-settings-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            maxLength="100"
            disabled={loading}
          />
        </div>

        <div className="group-settings-field">
          <label htmlFor="group-settings-description">
            Description
          </label>

          <textarea
            id="group-settings-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows="4"
            maxLength="500"
            disabled={loading}
          />

          <small>
            {description.length}/500
          </small>
        </div>

        <button
          type="submit"
          className="group-settings-save"
          disabled={
            loading ||
            deleting
          }
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>

      <div className="group-settings-danger">
        <h3>
          Danger Zone
        </h3>

        <p>
          Deleting this group cannot
          be easily undone.
        </p>

        <button
          type="button"
          className="group-settings-delete"
          onClick={handleDelete}
          disabled={
            loading ||
            deleting
          }
        >
          {deleting
            ? "Deleting..."
            : "Delete Group"}
        </button>
      </div>

    </div>
  );
};

export default GroupSettings;