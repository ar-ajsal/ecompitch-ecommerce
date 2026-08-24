const mongoose = require('mongoose');
const Order = require('../models/Order');
const { Cashfree, CFEnvironment } = require('cashfree-pg');

const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT === 'PROD' 
  ? CFEnvironment.PRODUCTION 
  : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(
  cashfreeEnv,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

// @desc    Create a Cashfree payment session for an existing order
// @route   POST /api/payment/create-session
// @access  Private
const createPaymentSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Cashfree expects order_id to be a string. We can use our DB ID.
    const customer_id = order.user._id.toString();
    const customer_phone = order.user.phone || '9999999999'; // Cashfree requires a valid 10-digit phone number. Replace with user phone if available.
    const customer_email = order.user.email || 'customer@example.com';
    const customer_name = order.user.name || 'Customer';

    const request = {
      order_amount: order.total,
      order_currency: 'INR',
      order_id: order._id.toString(),
      customer_details: {
        customer_id: customer_id,
        customer_phone: customer_phone,
        customer_email: customer_email,
        customer_name: customer_name,
      },
      order_meta: {
        return_url: `${(process.env.CLIENT_URL || 'http://localhost:3000').replace('http://', 'https://')}/checkout/success?order_id=${order._id.toString()}`,
        notify_url: `https://webhook.site/placeholder` // Webhook needs real https
      }
    };

    cashfree.PGCreateOrder(request)
      .then((response) => {
        const payment_session_id = response.data.payment_session_id;
        res.status(200).json({ payment_session_id, order_id: order._id });
      })
      .catch((error) => {
        console.error('Cashfree Create Order Error:', error?.response?.data || error);
        res.status(500).json({ message: 'Failed to create payment session', error: error?.response?.data?.message || error.message });
      });

  } catch (error) {
    next(error);
  }
};

// @desc    Verify Cashfree Payment Status
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Call Cashfree to check the payment status for this order_id
    cashfree.PGOrderFetchPayments(orderId)
      .then(async (response) => {
        const payments = response.data;
        
        // Find if any payment for this order was successful
        const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');
        
        if (successfulPayment) {
          if (order.paymentStatus !== 'Paid') {
            order.paymentStatus = 'Paid';
            
            // Deduct stock only when payment is successful
            const Product = require('../models/Product');
            for (const item of order.items) {
               await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
            }
            
            await order.save();
          }
          return res.status(200).json({ success: true, message: 'Payment verified and updated', order });
        } else {
          return res.status(400).json({ success: false, message: 'No successful payment found for this order', payments });
        }
      })
      .catch((error) => {
        console.error('Cashfree Verify Error:', error?.response?.data || error);
        res.status(500).json({ message: 'Failed to verify payment', error: error?.response?.data?.message || error.message });
      });

  } catch (error) {
    next(error);
  }
};


// @desc    Create a Cashfree payment session for a guest order
// @route   POST /api/payment/guest-create-session
// @access  Public
const createGuestPaymentSession = async (req, res, next) => {
  try {
    const { orderId, email, phone, name } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const customer_id = `guest_${order._id.toString()}`;
    const customer_phone = phone || '9999999999';
    const customer_email = email || 'customer@example.com';
    const customer_name = name || 'Customer';

    const request = {
      order_amount: order.total,
      order_currency: 'INR',
      order_id: order._id.toString(),
      customer_details: {
        customer_id: customer_id,
        customer_phone: customer_phone,
        customer_email: customer_email,
        customer_name: customer_name,
      },
      order_meta: {
        return_url: `${(process.env.CLIENT_URL || 'http://localhost:3000').replace('http://', 'https://')}/checkout/success?order_id=${order._id.toString()}`,
        notify_url: `https://webhook.site/placeholder`
      }
    };

    cashfree.PGCreateOrder(request)
      .then((response) => {
        const payment_session_id = response.data.payment_session_id;
        res.status(200).json({ payment_session_id, order_id: order._id });
      })
      .catch((error) => {
        console.error('Cashfree Create Guest Order Error:', error?.response?.data || error);
        res.status(500).json({ message: 'Failed to create payment session', error: error?.response?.data?.message || error.message });
      });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGuestPaymentSession,
  createPaymentSession,
  verifyPayment
};
