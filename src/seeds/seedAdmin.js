import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: 'admin@janjustice.com' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  await User.create({
    firstName: 'Jan',
    lastName: 'Justice',
    email: 'admin@janjustice.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
  });

  console.log('Admin user created: admin@janjustice.com / Admin@123');
  process.exit(0);
};

seedAdmin().catch((e) => { console.error(e); process.exit(1); });
