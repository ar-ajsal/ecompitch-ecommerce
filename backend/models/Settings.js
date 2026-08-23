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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
