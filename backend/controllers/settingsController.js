const Settings = require('../models/Settings');

// @desc    Get storefront settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update storefront settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({});
    }

    const {
      heroTitle,
      heroSubtitle,
      heroMedia,
      whatsappEnabled,
      whatsappNumber,
      manualUpiEnabled,
      upiId,
      upiBusinessName,
      upiQrImage,
      paymentInstructions,
    } = req.body;

    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroMedia !== undefined) settings.heroMedia = heroMedia;

    if (whatsappEnabled !== undefined) settings.whatsappEnabled = Boolean(whatsappEnabled);
    if (whatsappNumber !== undefined) settings.whatsappNumber = String(whatsappNumber).trim();
    if (manualUpiEnabled !== undefined) settings.manualUpiEnabled = Boolean(manualUpiEnabled);
    if (upiId !== undefined) settings.upiId = String(upiId).trim();
    if (upiBusinessName !== undefined) settings.upiBusinessName = String(upiBusinessName).trim();
    if (upiQrImage !== undefined) settings.upiQrImage = upiQrImage;
    if (paymentInstructions !== undefined) settings.paymentInstructions = paymentInstructions;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

