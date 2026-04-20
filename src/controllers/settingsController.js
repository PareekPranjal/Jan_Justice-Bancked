import Settings from '../models/Settings.js';
import cloudinary from '../config/cloudinary.js';

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
}

// GET /api/settings  (admin only)
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/settings/public  (public — returns only what the booking page needs)
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      success: true,
      data: {
        consultationFee: settings.consultationFee,
        upiId: settings.upiId,
        upiQrUrl: settings.upiQrUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings  (admin only)
export const updateSettings = async (req, res) => {
  try {
    const { presetFields, consultationFee, upiId, upiQrUrl, couponCodes } = req.body;

    const update = {};
    if (Array.isArray(presetFields))   update.presetFields = presetFields;
    if (consultationFee !== undefined) update.consultationFee = Number(consultationFee);
    if (upiId !== undefined)           update.upiId = upiId;
    if (upiQrUrl !== undefined)        update.upiQrUrl = upiQrUrl;
    if (Array.isArray(couponCodes))    update.couponCodes = couponCodes;

    const settings = await Settings.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/settings/upload-qr  (admin only)
export const uploadQrImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Convert buffer to base64 data URI — no extra dependencies needed
    const b64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'janjustice/qr',
      resource_type: 'image',
    });

    const url = result.secure_url;
    await Settings.findOneAndUpdate({}, { upiQrUrl: url }, { upsert: true, new: true });

    res.json({ success: true, data: { url } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/settings/validate-coupon  (public)
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

    const settings = await getOrCreateSettings();
    const coupon = settings.couponCodes.find(
      (c) => c.code === code.trim().toUpperCase() && c.isActive
    );

    if (!coupon) {
      return res.json({ success: false, message: 'Invalid or expired coupon code' });
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
