const fs = require("fs");
const path = require("path");

/*
==================================================
UPLOAD FILE
POST /api/upload
==================================================
*/

const uploadFile = async (req, res) => {
  try {
    /*
    ------------------------------------------
    CHECK FILE
    ------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    /*
    ------------------------------------------
    FILE INFORMATION
    ------------------------------------------
    */

    const file = req.file;

    const fileUrl =
      `/uploads/${file.filename}`;

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",

      file: {
        originalName:
          file.originalname,

        filename:
          file.filename,

        mimetype:
          file.mimetype,

        size:
          file.size,

        url:
          fileUrl,
      },
    });
  } catch (error) {
    console.error(
      "UPLOAD FILE ERROR:",
      error
    );

    /*
    ------------------------------------------
    DELETE FILE IF ERROR OCCURS
    ------------------------------------------
    */

    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      try {
        fs.unlinkSync(
          req.file.path
        );
      } catch (deleteError) {
        console.error(
          "FILE DELETE ERROR:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "File upload failed",
    });
  }
};

/*
==================================================
UPLOAD IMAGE
POST /api/upload/image
==================================================
*/

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const file = req.file;

    /*
    ------------------------------------------
    IMAGE CHECK
    ------------------------------------------
    */

    if (
      !file.mimetype.startsWith(
        "image/"
      )
    ) {
      /*
      Delete invalid file
      */

      if (
        file.path &&
        fs.existsSync(file.path)
      ) {
        fs.unlinkSync(file.path);
      }

      return res.status(400).json({
        success: false,
        message:
          "Only image files are allowed",
      });
    }

    const imageUrl =
      `/uploads/${file.filename}`;

    return res.status(201).json({
      success: true,
      message:
        "Image uploaded successfully",

      image: {
        originalName:
          file.originalname,

        filename:
          file.filename,

        mimetype:
          file.mimetype,

        size:
          file.size,

        url:
          imageUrl,
      },
    });
  } catch (error) {
    console.error(
      "UPLOAD IMAGE ERROR:",
      error
    );

    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      try {
        fs.unlinkSync(
          req.file.path
        );
      } catch (deleteError) {
        console.error(
          "IMAGE DELETE ERROR:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Image upload failed",
    });
  }
};

/*
==================================================
DELETE UPLOADED FILE
DELETE /api/upload/:filename
==================================================
*/

const deleteFile = async (req, res) => {
  try {
    const {
      filename,
    } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message:
          "Filename is required",
      });
    }

    /*
    ------------------------------------------
    SAFE FILE PATH
    ------------------------------------------
    */

    const uploadDirectory =
      path.join(
        __dirname,
        "../uploads"
      );

    const filePath =
      path.join(
        uploadDirectory,
        filename
      );

    /*
    ------------------------------------------
    SECURITY CHECK
    ------------------------------------------
    */

    const resolvedUploadDirectory =
      path.resolve(
        uploadDirectory
      );

    const resolvedFilePath =
      path.resolve(
        filePath
      );

    if (
      !resolvedFilePath.startsWith(
        resolvedUploadDirectory
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid file path",
      });
    }

    /*
    ------------------------------------------
    FILE EXISTS
    ------------------------------------------
    */

    if (
      !fs.existsSync(filePath)
    ) {
      return res.status(404).json({
        success: false,
        message:
          "File not found",
      });
    }

    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      message:
        "File deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE FILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "File deletion failed",
    });
  }
};

module.exports = {
  uploadFile,
  uploadImage,
  deleteFile,
};