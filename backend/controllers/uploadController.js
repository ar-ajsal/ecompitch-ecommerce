const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Use memory storage — we pipe the buffer directly to Cloudinary upload_stream
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
    }
  },
});

// Helper: upload buffer to Cloudinary using upload_stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'barter-products',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Upload a single product image to Cloudinary
// @route   POST /api/upload
// @access  Admin
const uploadImage = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      next(error);
    }
  },
];

// @desc    Delete an image from Cloudinary by public ID
// @route   DELETE /api/upload/:publicId
// @access  Admin
const deleteImage = async (req, res, next) => {
  try {
    const fullPublicId = decodeURIComponent(req.params.publicId);
    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(400).json({ message: 'Failed to delete image from Cloudinary' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, deleteImage };
