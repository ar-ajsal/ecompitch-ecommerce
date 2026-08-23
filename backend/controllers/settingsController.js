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

    const { heroTitle, heroSubtitle, heroMedia } = req.body;

    if (heroTitle) settings.heroTitle = heroTitle;
    if (heroSubtitle) settings.heroSubtitle = heroSubtitle;
    if (heroMedia) settings.heroMedia = heroMedia;

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
