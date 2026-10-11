import React from "react";

const GroupMembers = ({
  members = [],
  currentUser,
  onRemove,
  onSelect,
}) => {
  const currentUserId =
    currentUser?._id ||
    currentUser?.id;

  const getMemberId = (member) =>
    member?._id ||
    member?.id;

  const getMemberName = (member) =>
    member?.username ||
    member?.name ||
    "User";

  const getMemberAvatar = (member) =>
    member?.avatar ||
    member?.profilePicture ||
    "";

  const isAdmin = (member) =>
    member?.role === "admin" ||
    member?.isAdmin === true;

  if (!members.length) {
    return (
      <div className="group-members-empty">
        <div>
          👥
        </div>

        <h3>
          No members
        </h3>

        <p>
          This group doesn't have
          any members yet.
        </p>
      </div>
    );
  }

  return (
    <div className="group-members">

      <div className="group-members-header">
        <h2>
          Group Members
        </h2>

        <span>
          {members.length}
        </span>
      </div>

      <div className="group-members-list">
        {members.map(
          (member, index) => {
            const memberId =
              getMemberId(
                member
              ) || index;

            const name =
              getMemberName(
                member
              );

            const avatar =
              getMemberAvatar(
                member
              );

            const isCurrentUser =
              String(memberId) ===
              String(currentUserId);

            return (
              <div
                key={memberId}
                className="group-member"
              >
                <button
                  type="button"
                  className="group-member-main"
                  onClick={() =>
                    onSelect?.(
                      member
                    )
                  }
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="group-member-avatar"
                    />
                  ) : (
                    <div className="group-member-avatar group-member-avatar-default">
                      {name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="group-member-info">
                    <strong>
                      {name}
                      {isCurrentUser &&
                        " (You)"}
                    </strong>

                    <span>
                      {isAdmin(
                        member
                      )
                        ? "Admin"
                        : "Member"}
                    </span>
                  </div>
                </button>

                {isAdmin(
                  member
                ) && (
                  <span className="group-member-admin">
                    Admin
                  </span>
                )}

                {!isCurrentUser &&
                  onRemove && (
                    <button
                      type="button"
                      className="group-member-remove"
                      onClick={() =>
                        onRemove(
                          member
                        )
                      }
                      title="Remove member"
                    >
                      ×
                    </button>
                  )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default GroupMembers;