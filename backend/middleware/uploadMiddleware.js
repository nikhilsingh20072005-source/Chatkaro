const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*
==================================================
UPLOAD DIRECTORY
==================================================
*/

const uploadDir = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/*
==================================================
STORAGE
==================================================
*/

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(null, uploadDir);
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const uniqueName =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(
          file.originalname
        )}`;

      cb(
        null,
        uniqueName
      );
    },
  });

/*
==================================================
FILE FILTER
==================================================
*/
const fileFilter = (req, file, cb) => {
  console.log("UPLOAD FILE DEBUG:", {
    originalName: file.originalname,
    mimeType: file.mimetype,
    extension: path.extname(file.originalname),
  });

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(`Unsupported file type: ${file.mimetype}`),
    false
  );
};


/*
==================================================
MULTER
==================================================
*/

const uploadMiddleware =
  multer({
    storage,
    fileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  });

module.exports =
  uploadMiddleware;