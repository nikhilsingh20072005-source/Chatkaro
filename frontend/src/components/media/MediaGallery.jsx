import React, { useState } from "react";

import ImagePreview from "./ImagePreview";

const MediaGallery = ({
  media = [],
}) => {
  const [selectedImage, setSelectedImage] =
    useState(null);

  const images = media.filter(
    (item) =>
      item?.type === "image" ||
      item?.mimeType?.startsWith(
        "image/"
      ) ||
      item?.url
  );

  if (!images.length) {
    return (
      <div className="media-gallery-empty">
        <p>
          No media available.
        </p>
      </div>
    );
  }

  const handleImageClick = (
    image
  ) => {
    setSelectedImage(
      image?.url ||
        image?.fileUrl ||
        image?.path ||
        ""
    );
  };

  return (
    <>
      <div
        className={`media-gallery media-gallery-${Math.min(
          images.length,
          4
        )}`}
      >
        {images.map(
          (image, index) => {
            const src =
              image?.url ||
              image?.fileUrl ||
              image?.path ||
              "";

            if (!src) {
              return null;
            }

            return (
              <button
                type="button"
                key={
                  image?._id ||
                  image?.id ||
                  index
                }
                className="media-gallery-item"
                onClick={() =>
                  handleImageClick(
                    image
                  )
                }
              >
                <img
                  src={src}
                  alt={
                    image?.name ||
                    `Media ${index + 1}`
                  }
                  loading="lazy"
                />
              </button>
            );
          }
        )}
      </div>

      <ImagePreview
        src={selectedImage}
        alt="Preview"
        isOpen={
          Boolean(selectedImage)
        }
        onClose={() =>
          setSelectedImage(null)
        }
      />
    </>
  );
};

export default MediaGallery;