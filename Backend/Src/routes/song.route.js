const express = require("express");
const multer = require("multer");
const upload = require("../middlewares/upload.middleware");
const songController = require("../controllers/song.controller");

const router = express.Router();
router.post(
  "/",
  upload.single("song"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Max size is 50MB."
        });
      }
      return res.status(400).json({ message: err.message });
    }

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    next();
  },
  songController.uploadsongs
);

// GET /songs?mood=happy
router.get("/", songController.getsong);

module.exports = router;