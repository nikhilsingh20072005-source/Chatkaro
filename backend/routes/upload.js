const express = require("express");

const {
  uploadFile,
  uploadImage,
  deleteFile,
} = require("../controllers/uploadController");

const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

/*
==================================================
UPLOAD FILE
POST /api/upload
==================================================
*/

router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("file"),
  uploadFile
);

/*
==================================================
UPLOAD IMAGE
POST /api/upload/image
==================================================
*/

router.post(
  "/image",
  authMiddleware,
  uploadMiddleware.single("file"),
  uploadImage
);

/*
==================================================
DELETE FILE
DELETE /api/upload/:filename
==================================================
*/

router.delete(
  "/:filename",
  authMiddleware,
  deleteFile
);

module.exports = router;