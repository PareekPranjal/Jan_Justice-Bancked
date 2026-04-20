import mongoose from 'mongoose';

// Singleton document — one settings record for the whole app
const settingsSchema = new mongoose.Schema(
  {
    presetFields: {
      type: [String],
      default: ['Post Name', 'Age', 'Qualification', 'Experience', 'Salary'],
    },
    // Consultancy payment settings
    consultationFee: {
      type: Number,
      default: 500,
    },
    upiId: {
      type: String,
      default: '',
      trim: true,
    },
    upiQrUrl: {
      type: String,
      default: '',
    },
    // Coupon codes for consultation fee discounts
    couponCodes: [
      {
        code: { type: String, required: true, trim: true, uppercase: true },
        discountType: { type: String, enum: ['percent', 'fixed'], default: 'fixed' },
        discountValue: { type: Number, required: true, min: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
