import React, { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title = "",
  children,
  showCloseButton = true,
  size = "medium",
}) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={`modal-container modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title
            ? "modal-title"
            : undefined
        }
      >
        <div className="modal-header">
          {title && (
            <h2 id="modal-title">
              {title}
            </h2>
          )}

          {showCloseButton && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;