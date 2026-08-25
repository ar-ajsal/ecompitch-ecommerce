const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: 'High-quality tech gadgets & accessories.',
    },
    heroSubtitle: {
      type: String,
      default: 'Useful objects, made beautiful. Discover considered technology for work, rest and everything in between.',
    },
    heroMedia: {
      url: { type: String, default: '/videos/hero.mp4' },
      publicId: { type: String, default: '' },
      type: { type: String, enum: ['image', 'video'], default: 'video' }
    },

    // ── Business feature toggles ──────────────────────────────────────────────
    whatsappEnabled: {
      type: Boolean,
      default: false,
    },
    // The business WhatsApp number in E.164 format (e.g. 919745107425)
    whatsappNumber: {
      type: String,
      default: '',
    },
    // Master toggles
    manualUpiEnabled: {
      type: Boolean,
      default: false,
    },
    upiId: {
      type: String,
      default: '',
    },
    upiBusinessName: {
      type: String,
      default: '',
    },
    upiQrImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    paymentInstructions: {
      type: String,
      default: 'Scan the QR code and complete payment. Enter your UTR / Transaction ID below.',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
