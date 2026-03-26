const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  },
  fileFilter
});

module.exports = upload;