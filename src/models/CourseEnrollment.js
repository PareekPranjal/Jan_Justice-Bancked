import mongoose from 'mongoose';

const courseEnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },
    status: {
      type: String,
      enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
      default: 'enrolled',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
courseEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Automatically update status based on progress
courseEnrollmentSchema.pre('save', function (next) {
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.progress > 0 && this.progress < 100 && this.status === 'enrolled') {
    this.status = 'in-progress';
  }
  next();
});

const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);

export default CourseEnrollment;
