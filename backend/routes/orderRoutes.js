const express = require('express');
const {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// Specific routes MUST come before /:id
router.post('/', protect, createOrder);
router.post('/guest', createGuestOrder);
router.get('/my', protect, getMyOrders);

// Admin routes — must also be before /:id
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/admin/:id/verify-payment', protect, adminOnly, verifyPayment);

// Dynamic :id route — must be LAST
router.get('/:id', protect, getOrderById);

module.exports = router;
