import Settings from '../models/Settings.js';

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const { presetFields } = req.body;

    if (!Array.isArray(presetFields)) {
      return res.status(400).json({ success: false, message: 'presetFields must be an array' });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { presetFields },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
