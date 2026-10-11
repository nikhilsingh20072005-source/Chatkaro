import React, { useEffect } from "react";

const ImagePreview = ({
  src,
  alt = "Image",
  isOpen = false,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) {
    return null;
  }

  const handleBackdropClick = (
    event
  ) => {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="image-preview-overlay"
      onClick={
        handleBackdropClick
      }
      role="presentation"
    >
      <button
        type="button"
        className="image-preview-close"
        onClick={onClose}
        aria-label="Close image"
        title="Close"
      >
        ×
      </button>

      <div className="image-preview-container">
        <img
          src={src}
          alt={alt}
          className="image-preview-image"
        />
      </div>
    </div>
  );
};

export default ImagePreview;