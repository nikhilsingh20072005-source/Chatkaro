
import React, { useEffect, useState } from "react";
import { createGroup } from "../../services/groups";
import { getUsers } from "../../services/users";

const CreateGroup = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const response = await getUsers();
        const list =
          response?.users ||
          response?.data?.users ||
          response?.data ||
          [];

        if (!cancelled) {
          setUsers(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("LOAD USERS ERROR:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load users. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const getId = (user) => user?._id || user?.id;

  const toggleMember = (userId) => {
    setSelectedMembers((previous) =>
      previous.includes(userId)
        ? previous.filter((id) => id !== userId)
        : [...previous, userId]
    );
  };

  const filteredUsers = users.filter((user) => {
    const text = search.trim().toLowerCase();

    return (
      !text ||
      (user.username || "").toLowerCase().includes(text) ||
      (user.name || "").toLowerCase().includes(text) ||
      (user.email || "").toLowerCase().includes(text)
    );
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Group name must contain at least 2 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await createGroup({
        name: name.trim(),
        description: description.trim(),
        members: selectedMembers,
      });

      const group =
        response?.group ||
        response?.data?.group ||
        null;

      if (!group) {
        throw new Error(
          "Group created, but group details were not returned."
        );
      }

      setSuccess("Group created successfully.");
      setName("");
      setDescription("");
      setSelectedMembers([]);

      onSuccess?.(group);
    } catch (err) {
      console.error("CREATE GROUP ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create group."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group">
      <div className="create-group-header">
        <h2>Create New Group</h2>
        <p>Select friends to start a group conversation.</p>
      </div>

      {error && (
        <div className="create-group-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="create-group-success" role="status">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-group-form">
        <div className="create-group-field">
          <label htmlFor="group-name">Group Name</label>
          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter group name"
            maxLength={100}
            required
            disabled={loading}
          />
        </div>

        <div className="create-group-field">
          <label htmlFor="group-description">Description</label>
          <textarea
            id="group-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter group description"
            rows={3}
            maxLength={300}
            disabled={loading}
          />
          <small>{description.length}/300</small>
        </div>

        <div className="create-group-members">
          <div className="create-group-members-heading">
            <label>Select Friends</label>
            <span>{selectedMembers.length} selected</span>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users"
            disabled={loading}
          />

          {loadingUsers ? (
            <p className="create-group-users-status">
              Loading users...
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="create-group-users-status">
              No users found.
            </p>
          ) : (
            <div className="create-group-users-list">
              {filteredUsers.map((user) => {
                const userId = getId(user);

                if (!userId) return null;

                const displayName =
                  user.username || user.name || "User";

                return (
                  <label
                    className="create-group-user"
                    key={userId}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(String(userId))}
                      onChange={() => toggleMember(String(userId))}
                      disabled={loading}
                    />

                    <span className="create-group-user-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </span>

                    <span className="create-group-user-details">
                      <strong>{displayName}</strong>
                      {user.email && <small>{user.email}</small>}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="create-group-actions">
          {onCancel && (
            <button
              type="button"
              className="create-group-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="create-group-submit"
            disabled={loading || loadingUsers}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
