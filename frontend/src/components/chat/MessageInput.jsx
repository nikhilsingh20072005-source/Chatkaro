import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  value = "",

  onChange,

  onSend,

  onTyping,

  onStopTyping,

  disabled = false,

  placeholder = "Type a message...",

  /*
  ==========================================
  AI
  ==========================================
  */

  aiMode = false,

  onAskAI,
}) => {

  const fileInputRef =
    useRef(null);

  const emojiPickerRef =
    useRef(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  /*
  ==========================================
  TEXT CHANGE
  ==========================================
  */

  const handleChange = (
    event
  ) => {

    const newValue =
      event.target.value;

    onChange?.(
      newValue
    );

    if (
      newValue.trim()
    ) {
      onTyping?.();
    } else {
      onStopTyping?.();
    }
  };

  /*
  ==========================================
  EMOJI
  ==========================================
  */

  const handleEmojiClick = (
    emojiData
  ) => {

    const emoji =
      emojiData.emoji;

    onChange?.(
      `${value}${emoji}`
    );

    onTyping?.();
  };

  /*
  ==========================================
  SEND
  ==========================================
  */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (
      disabled ||
      (
        !value.trim() &&
        !selectedFile
      )
    ) {
      return;
    }

    /*
    ========================================
    AI MODE
    ========================================
    */

    if (aiMode) {

      if (
        !value.trim()
      ) {
        return;
      }

      try {

        await onAskAI?.(
          value.trim()
        );

        setShowEmojiPicker(
          false
        );

        onStopTyping?.();

      } catch (error) {

        console.error(
          "AI INPUT ERROR:",
          error
        );
      }

      return;
    }

    /*
    ========================================
    NORMAL CHAT
    ========================================
    */

    try {

      await onSend?.({
        content:
          value,

        file:
          selectedFile,
      });

      setSelectedFile(
        null
      );

      setShowEmojiPicker(
        false
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

      onStopTyping?.();

    } catch (error) {

      console.error(
        "MESSAGE INPUT SEND ERROR:",
        error
      );
    }
  };

  /*
  ==========================================
  ENTER KEY
  ==========================================
  */

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSubmit(
        event
      );
    }
  };

  /*
  ==========================================
  FILE SELECT
  ==========================================
  */

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(
      file
    );
  };

  /*
  ==========================================
  REMOVE FILE
  ==========================================
  */

  const removeFile = () => {

    setSelectedFile(
      null
    );

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };

  /*
  ==========================================
  CLOSE EMOJI PICKER
  ==========================================
  */

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(
          event.target
        )
      ) {

        setShowEmojiPicker(
          false
        );
      }
    };

    if (
      showEmojiPicker
    ) {

      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, [
    showEmojiPicker,
  ]);

  /*
  ==========================================
  FILE TYPE
  ==========================================
  */

  const isImage =
    selectedFile?.type?.startsWith(
      "image/"
    );

  return (
    <form
      className={`message-input ${
        aiMode
          ? "message-input-ai"
          : ""
      }`}
      onSubmit={
        handleSubmit
      }
    >

      {/* ==================================
          AI MODE LABEL
      ================================== */}

      {aiMode && (
        <div className="ai-input-label">
          🤖
          <span>
            ChatKaro AI
          </span>
        </div>
      )}

      {/* ==================================
          EMOJI
      ================================== */}

      {!aiMode && (
        <div
          className="emoji-picker-wrapper"
          ref={
            emojiPickerRef
          }
        >

          <button
            type="button"
            className="message-input-emoji"
            onClick={() =>
              setShowEmojiPicker(
                (previous) =>
                  !previous
              )
            }
            disabled={
              disabled
            }
            aria-label="Emoji"
            title="Emoji"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker-container">

              <EmojiPicker
                onEmojiClick={
                  handleEmojiClick
                }

                width={320}

                height={400}

                searchDisabled={
                  false
                }

                skinTonesDisabled={
                  false
                }

                previewConfig={{
                  showPreview:
                    false,
                }}
              />

            </div>
          )}

        </div>
      )}

      {/* ==================================
          ATTACHMENT
      ================================== */}

      {!aiMode && (
        <>
          <button
            type="button"
            className="message-input-attach"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={
              disabled
            }
            aria-label="Attach file"
            title="Attach file"
          >
            📎
          </button>

          <input
            ref={
              fileInputRef
            }
            type="file"
            hidden
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={
              handleFileChange
            }
          />
        </>
      )}

      {/* ==================================
          SELECTED FILE
      ================================== */}

      {selectedFile &&
        !aiMode && (
          <div className="selected-file">

            {isImage ? (

              <img
                src={
                  URL.createObjectURL(
                    selectedFile
                  )
                }
                alt="Preview"
                className="selected-file-preview"
              />

            ) : (

              <span className="selected-file-icon">
                📄
              </span>

            )}

            <div className="selected-file-info">

              <strong>
                {selectedFile.name}
              </strong>

              <small>
                {(
                  selectedFile.size /
                  1024
                ).toFixed(1)}{" "}
                KB
              </small>

            </div>

            <button
              type="button"
              className="selected-file-remove"
              onClick={
                removeFile
              }
              aria-label="Remove file"
              title="Remove file"
            >
              ×
            </button>

          </div>
        )}

      {/* ==================================
          MESSAGE TEXT
      ================================== */}

      <textarea
        value={
          value
        }

        onChange={
          handleChange
        }

        onKeyDown={
          handleKeyDown
        }

        onBlur={
          onStopTyping
        }

        placeholder={
          placeholder
        }

        disabled={
          disabled
        }

        rows={1}

        autoComplete="off"

        className="message-input-textarea"
      />

      {/* ==================================
          SEND / AI BUTTON
      ================================== */}

    <button
  type="submit"
  className={`message-input-send ${
    aiMode
      ? "message-input-ai-send"
      : ""
  }`}
  disabled={
    disabled ||
    (
      !value.trim() &&
      !selectedFile
    )
  }
  aria-label={
    aiMode
      ? "Ask AI"
      : "Send message"
  }
  title={
    aiMode
      ? "Ask ChatKaro AI"
      : "Send message"
  }
>
  {aiMode
    ? "🤖"
    : "➤"}
</button>

    </form>
  );
};

export default MessageInput;