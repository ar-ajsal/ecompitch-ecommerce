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
      onlinePaymentEnabled,
    } = req.body;

    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroMedia !== undefined) settings.heroMedia = heroMedia;

    // Boolean fields — safely coerce since they may arrive as strings from form submissions
    if (whatsappEnabled !== undefined) settings.whatsappEnabled = Boolean(whatsappEnabled);
    if (whatsappNumber !== undefined) settings.whatsappNumber = String(whatsappNumber).trim();
    if (onlinePaymentEnabled !== undefined) settings.onlinePaymentEnabled = Boolean(onlinePaymentEnabled);

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

