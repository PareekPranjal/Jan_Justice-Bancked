import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one record per visitor per day
pageViewSchema.index({ visitorId: 1, date: 1 }, { unique: true });
// Fast aggregation queries by date
pageViewSchema.index({ date: 1 });

const PageView = mongoose.model('PageView', pageViewSchema);

export default PageView;
