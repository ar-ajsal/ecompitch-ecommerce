const express = require('express');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

router.post('/', protect, adminOnly, uploadImage);
router.delete('/:publicId', protect, adminOnly, deleteImage);

module.exports = router;
