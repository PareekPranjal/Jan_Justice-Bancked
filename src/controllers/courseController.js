import Course from '../models/Course.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category, level } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid course data',
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid course data',
      error: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
