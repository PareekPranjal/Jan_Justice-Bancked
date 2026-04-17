import mongoose from 'mongoose';

// Singleton document — one settings record for the whole app
const settingsSchema = new mongoose.Schema(
  {
    presetFields: {
      type: [String],
      default: ['Post Name', 'Age', 'Qualification', 'Experience', 'Salary'],
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
