const path = require('path');
const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Memory storage for Multer (we will pipe directly to Cloudinary)
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'eternal_attires_products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const formattedData = results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));

    res.json({
      message: 'Images Uploaded Successfully',
      images: formattedData,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload: ' + error.message });
  }
});

module.exports = router;
