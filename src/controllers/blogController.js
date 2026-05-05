import Blog from '../models/Blog.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (e) {
    console.warn('Cloudinary blog image delete failed:', e.message);
  }
};

const FEATURED_LIMIT = 3;

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public (published only) / Admin (all when ?admin=true)
export const getBlogs = async (req, res) => {
  try {
    const { admin, search } = req.query;
    const filter = admin === 'true' ? {} : { isPublished: true };

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get featured blogs (top 3 most recent)
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isFeatured: true, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(FEATURED_LIMIT);
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Upload blog cover image
// @route   POST /api/blogs/upload-image
// @access  Private/Admin
export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'jan-justice/blogs',
      resource_type: 'image',
    });
    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    // If admin tries to feature this blog, enforce the cap
    if (req.body.isFeatured) {
      const featuredCount = await Blog.countDocuments({ isFeatured: true });
      if (featuredCount >= FEATURED_LIMIT) {
        return res.status(400).json({
          success: false,
          message: `You can feature at most ${FEATURED_LIMIT} articles. Un-feature one first.`,
        });
      }
    }
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid blog data', error: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Featured cap: only count OTHER blogs
    if (req.body.isFeatured === true && !existing.isFeatured) {
      const featuredCount = await Blog.countDocuments({ isFeatured: true, _id: { $ne: existing._id } });
      if (featuredCount >= FEATURED_LIMIT) {
        return res.status(400).json({
          success: false,
          message: `You can feature at most ${FEATURED_LIMIT} articles. Un-feature one first.`,
        });
      }
    }

    // If image is being replaced, delete the old Cloudinary asset
    const oldPublicId = existing.image?.publicId;
    const newPublicId = req.body.image?.publicId;
    if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
      await deleteCloudinaryImage(oldPublicId);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid blog data', error: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    await deleteCloudinaryImage(blog.image?.publicId);
    await blog.deleteOne();

    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
