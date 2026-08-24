const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPaymentSession, verifyPayment, createGuestPaymentSession } = require('../controllers/paymentController');

// All payment routes are protected (require user login)
router.route('/create-session').post(protect, createPaymentSession);
router.route('/guest-create-session').post(createGuestPaymentSession);
router.route('/verify').post(protect, verifyPayment);
router.route('/guest-verify').post(verifyPayment);

module.exports = router;
