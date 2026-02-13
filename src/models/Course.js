import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lessons: [String],
});

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  bio: {
    type: String,
  },
  initials: {
    type: String,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    detailedDescription: {
      type: String,
      maxlength: [2000, 'Detailed description cannot be more than 2000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please add a course image URL'],
    },
    duration: {
      type: String,
      required: [true, 'Please add course duration'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    students: {
      type: Number,
      default: 0,
    },
    certified: {
      type: Boolean,
      default: true,
    },
    price: {
      current: {
        type: Number,
        required: true,
      },
      original: {
        type: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    features: [String],
    modules: [moduleSchema],
    instructor: instructorSchema,
    category: {
      type: String,
      required: true,
    },
    videoHours: {
      type: String,
    },
    resources: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
