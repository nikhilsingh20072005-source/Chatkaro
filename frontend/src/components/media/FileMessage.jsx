import React from "react";

const FileMessage = ({
  file,
  isOwnMessage = false,
}) => {
  if (!file) {
    return null;
  }

  const fileUrl =
    file.url ||
    file.path ||
    file.fileUrl ||
    "";

  const fileName =
    file.name ||
    file.originalName ||
    "File";

  const fileSize = file.size
    ? `${(
        file.size / 1024
      ).toFixed(1)} KB`
    : "";

  const extension =
    fileName
      .split(".")
      .pop()
      ?.toUpperCase() || "FILE";

  return (
    <div
      className={`file-message ${
        isOwnMessage
          ? "file-message-own"
          : "file-message-other"
      }`}
    >
      <div className="file-message-icon">
        📄
      </div>

      <div className="file-message-info">
        <strong
          title={fileName}
        >
          {fileName}
        </strong>

        <span>
          {extension}
          {fileSize
            ? ` • ${fileSize}`
            : ""}
        </span>
      </div>

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="file-message-download"
          download
          aria-label={`Download ${fileName}`}
          title="Download"
        >
          ⬇️
        </a>
      )}
    </div>
  );
};

export default FileMessage;