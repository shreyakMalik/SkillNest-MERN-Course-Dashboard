// seed.js - Run: node seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/course_dashboard';

const users = [
  { name: 'Admin User', email: 'admin@SkillNest.com', password: 'admin123', role: 'admin' },
  { name: 'Priya Sharma', email: 'priya@example.com', password: 'student123', role: 'user' },
  { name: 'Rahul Verma', email: 'rahul@example.com', password: 'student123', role: 'user' },
];

const courseSeed = (adminId) => [
  {
    title: 'Complete React Developer Course',
    description: 'Master React from scratch. Build real-world apps with hooks, Redux, and more.',
    instructor: 'Vishwas Gopinath',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '32 hours',
    price: 1499,
    tags: ['react', 'javascript', 'frontend'],
    isPublished: true,
    enrollmentCount: 0,
    rating: 4.8,
    createdBy: adminId
  },
  {
    title: 'Python for Data Science & ML',
    description: 'From Python basics to machine learning. Pandas, NumPy, Scikit-learn covered.',
    instructor: 'Kirill Eremenko',
    category: 'Data Science',
    level: 'Beginner',
    duration: '40 hours',
    price: 1999,
    tags: ['python', 'data science', 'machine learning'],
    isPublished: true,
    enrollmentCount: 0,
    rating: 4.7,
    createdBy: adminId
  },
  {
    title: 'Flutter & Dart Complete Guide',
    description: 'Build beautiful iOS and Android apps with Flutter. No prior experience needed.',
    instructor: 'Maximilian Schwarzmüller',
    category: 'Mobile Development',
    level: 'Beginner',
    duration: '28 hours',
    price: 1299,
    tags: ['flutter', 'dart', 'mobile'],
    isPublished: true,
    enrollmentCount: 0,
    rating: 4.6,
    createdBy: adminId
  },
  {
    title: 'Docker & Kubernetes Masterclass',
    description: 'Containerize and orchestrate your applications like a pro.',
    instructor: 'Mumshad Mannambeth',
    category: 'DevOps',
    level: 'Advanced',
    duration: '20 hours',
    price: 2499,
    tags: ['docker', 'kubernetes', 'devops'],
    isPublished: true,
    enrollmentCount: 0,
    rating: 4.9,
    createdBy: adminId
  },
  {
    title: 'UI/UX Design with Figma',
    description: 'Learn professional UI/UX design principles and tools from scratch.',
    instructor: 'Daniel Walter Scott',
    category: 'Design',
    level: 'Beginner',
    duration: '15 hours',
    price: 0,
    tags: ['figma', 'ui', 'ux', 'design'],
    isPublished: true,
    enrollmentCount: 0,
    rating: 4.5,
    createdBy: adminId
  },
  {
    title: 'Node.js, Express & MongoDB Bootcamp',
    description: 'Build RESTful APIs and full-stack apps with the MERN stack.',
    instructor: 'Jonas Schmedtmann',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '42 hours',
    price: 1799,
    tags: ['nodejs', 'express', 'mongodb', 'backend'],
    isPublished: true,
    enrollmentCount: 0,
    rating: 4.9,
    createdBy: adminId
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const User = require('./models/User');
  const Course = require('./models/Course');
  const Enrollment = require('./models/Enrollment');

  await User.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  console.log('🗑  Cleared existing data');

  const createdUsers = await User.create(users);
  console.log(`👥 Created ${createdUsers.length} users`);

  const admin = createdUsers.find(u => u.role === 'admin');
  const createdCourses = await Course.create(courseSeed(admin._id));
  console.log(`📚 Created ${createdCourses.length} courses`);

  console.log('\n🎉 Seed complete!\n');
  console.log('Login credentials:');
  console.log('  Admin  → admin@SkillNest.com / admin123');
  console.log('  Student → priya@example.com / student123\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
