import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import CourseEnrollment from './models/CourseEnrollment.js';
import SavedJob from './models/SavedJob.js';
import Course from './models/Course.js';
import Job from './models/Job.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legalhub';

const seedUserData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample user
    console.log('Creating sample user...');
    const existingUser = await User.findOne({ email: 'sarah.johnson@example.com' });

    let user;
    if (existingUser) {
      console.log('User already exists, using existing user');
      user = existingUser;
    } else {
      user = await User.create({
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        title: 'Senior Corporate Attorney',
        company: 'Sullivan & Cromwell LLP',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        bio: 'Experienced corporate attorney specializing in M&A and securities law.',
      });
      console.log('User created successfully');
    }

    // Get some courses and jobs from the database
    const courses = await Course.find().limit(3);
    const jobs = await Job.find().limit(3);

    if (courses.length > 0) {
      console.log(`Found ${courses.length} courses, creating enrollments...`);

      // Create course enrollments if they don't exist
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const existingEnrollment = await CourseEnrollment.findOne({
          userId: user._id,
          courseId: course._id,
        });

        if (!existingEnrollment) {
          const progress = i === 0 ? 75 : i === 1 ? 45 : 100;
          await CourseEnrollment.create({
            userId: user._id,
            courseId: course._id,
            progress,
          });
          console.log(`  - Enrolled in "${course.title}" with ${progress}% progress`);
        } else {
          console.log(`  - Already enrolled in "${course.title}"`);
        }
      }
    } else {
      console.log('No courses found in database. Skipping course enrollments.');
    }

    if (jobs.length > 0) {
      console.log(`Found ${jobs.length} jobs, creating saved jobs...`);

      // Create saved jobs if they don't exist
      for (const job of jobs) {
        const existingSave = await SavedJob.findOne({
          userId: user._id,
          jobId: job._id,
        });

        if (!existingSave) {
          await SavedJob.create({
            userId: user._id,
            jobId: job._id,
          });
          console.log(`  - Saved job "${job.title}"`);
        } else {
          console.log(`  - Already saved job "${job.title}"`);
        }
      }
    } else {
      console.log('No jobs found in database. Skipping saved jobs.');
    }

    console.log('\n✅ Sample user data seeded successfully!');
    console.log(`User email: ${user.email}`);
    console.log(`User ID: ${user._id}`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedUserData();
