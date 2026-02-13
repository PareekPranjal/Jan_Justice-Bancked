import Job from '../models/Job.js';
import Course from '../models/Course.js';
import Appointment from '../models/Appointment.js';

// @desc    Get homepage statistics
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res) => {
  try {
    // Get total counts
    const [totalJobs, totalCourses, totalAppointments] = await Promise.all([
      Job.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true }),
      Appointment.countDocuments({ status: { $in: ['pending', 'confirmed', 'completed'] } }),
    ]);

    // Get average course rating
    const courseRatingResult = await Course.aggregate([
      { $match: { isActive: true, rating: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalStudents: { $sum: '$students' },
        },
      },
    ]);

    const avgCourseRating = courseRatingResult.length > 0
      ? courseRatingResult[0].avgRating.toFixed(1)
      : '4.9';

    const totalStudents = courseRatingResult.length > 0
      ? courseRatingResult[0].totalStudents
      : 0;

    // Calculate success rate (completed appointments / total appointments)
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const successRate = totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 95;

    const stats = {
      jobs: {
        total: totalJobs,
        display: formatNumber(totalJobs),
      },
      courses: {
        total: totalCourses,
        display: totalCourses.toString(),
      },
      rating: {
        value: parseFloat(avgCourseRating),
        display: avgCourseRating,
      },
      successRate: {
        value: successRate,
        display: `${successRate}%`,
      },
      students: {
        total: totalStudents,
        display: formatNumber(totalStudents),
      },
      appointments: {
        total: totalAppointments,
        display: formatNumber(totalAppointments),
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
    });
  }
};

// Helper function to format numbers (e.g., 50000 -> 50K+)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
  }
  return num.toString();
}
