const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// Specific routes MUST come before /:id
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin routes — must also be before /:id
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus);

// Dynamic :id route — must be LAST
router.get('/:id', protect, getOrderById);

module.exports = router;
