import User from '../models/User.js';
import SavedJob from '../models/SavedJob.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Appointment from '../models/Appointment.js';
import Job from '../models/Job.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public (should be protected with auth in production)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile by email
// @route   GET /api/users/profile/:email
// @access  Public (should be protected with auth in production)
export const getUserProfile = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update user profile
// @route   POST /api/users/profile
// @access  Public (should be protected with auth in production)
export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const { email, firstName, lastName, phone, location, title, company, avatar, bio } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, first name, and last name are required',
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phone || user.phone;
      user.location = location || user.location;
      user.title = title || user.title;
      user.company = company || user.company;
      user.avatar = avatar || user.avatar;
      user.bio = bio || user.bio;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } else {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        location,
        title,
        company,
        avatar,
        bio,
      });

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats/:email
// @access  Public (should be protected with auth in production)
export const getUserStats = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get completed courses count
    const completedCourses = await CourseEnrollment.countDocuments({
      userId: user._id,
      status: 'completed',
    });

    // Get total enrollments (as applications sent)
    const totalEnrollments = await CourseEnrollment.countDocuments({
      userId: user._id,
    });

    // Get appointments count (as consultations)
    const consultations = await Appointment.countDocuments({
      email: email.toLowerCase(),
      status: { $ne: 'cancelled' },
    });

    // Certificates = completed courses
    const certificates = completedCourses;

    res.status(200).json({
      success: true,
      data: {
        coursesCompleted: completedCourses,
        applicationsSent: totalEnrollments,
        consultations,
        certificates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved jobs
// @route   GET /api/users/saved-jobs/:email
// @access  Public (should be protected with auth in production)
export const getSavedJobs = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const savedJobs = await SavedJob.find({ userId: user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    const jobs = savedJobs.map((saved) => ({
      ...saved.jobId.toObject(),
      savedAt: saved.createdAt,
      savedJobId: saved._id,
    }));

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a job
// @route   POST /api/users/saved-jobs
// @access  Public (should be protected with auth in production)
export const saveJob = async (req, res, next) => {
  try {
    const { email, jobId } = req.body;

    if (!email || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Email and job ID are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({ userId: user._id, jobId });
    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved',
      });
    }

    const savedJob = await SavedJob.create({ userId: user._id, jobId });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: savedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave a job
// @route   DELETE /api/users/saved-jobs/:savedJobId
// @access  Public (should be protected with auth in production)
export const unsaveJob = async (req, res, next) => {
  try {
    const { savedJobId } = req.params;

    const savedJob = await SavedJob.findById(savedJobId);

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    await savedJob.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job removed from saved list',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's course enrollments
// @route   GET /api/users/enrollments/:email
// @access  Public (should be protected with auth in production)
export const getCourseEnrollments = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const enrollments = await CourseEnrollment.find({ userId: user._id })
      .populate('courseId')
      .sort({ createdAt: -1 });

    const courses = enrollments.map((enrollment) => ({
      ...enrollment.courseId.toObject(),
      progress: enrollment.progress,
      enrollmentStatus: enrollment.status,
      enrolledAt: enrollment.createdAt,
      completedAt: enrollment.completedAt,
      enrollmentId: enrollment._id,
    }));

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in a course
// @route   POST /api/users/enrollments
// @access  Public (should be protected with auth in production)
export const enrollInCourse = async (req, res, next) => {
  try {
    const { email, courseId } = req.body;

    if (!email || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Email and course ID are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({ userId: user._id, courseId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
      });
    }

    const enrollment = await CourseEnrollment.create({ userId: user._id, courseId });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress
// @route   PUT /api/users/enrollments/:enrollmentId
// @access  Public (should be protected with auth in production)
export const updateCourseProgress = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Valid progress value (0-100) is required',
      });
    }

    const enrollment = await CourseEnrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    enrollment.progress = progress;
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (should be protected with auth in production)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete user's saved jobs
    await SavedJob.deleteMany({ userId: id });

    // Delete user's course enrollments
    await CourseEnrollment.deleteMany({ userId: id });

    // Delete the user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
