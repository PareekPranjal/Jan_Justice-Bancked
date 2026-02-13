import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate saves
savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

export default SavedJob;
