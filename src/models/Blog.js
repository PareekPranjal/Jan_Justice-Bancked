import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['heading', 'paragraph'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

blogSchema.index({ isFeatured: 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
