const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || file.mimetype.startsWith("image/") || file.mimetype === "application/octet-stream") {
            cb(null, true);
        } else {
            cb(null, true); // Allow upload and process
        }
    }
});

module.exports = upload;
