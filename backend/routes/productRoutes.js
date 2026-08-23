const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// Public routes — specific routes MUST come before /:id
router.get('/', getProducts);
router.get('/categories', getCategories);

// Admin routes (protected) — also before /:id
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number').custom((v) => v >= 0),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  createProduct
);

// This must be before /:id
router.get('/admin/all', protect, adminOnly, getAdminProducts);

// Dynamic :id routes — must be LAST
router.get('/:id', getProductById);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
