const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/enrollments/:courseId - Enroll in a course
router.post('/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (!course.isPublished) return res.status(400).json({ success: false, message: 'Course is not available' });

    const existing = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: req.params.courseId
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrollmentCount: 1 } });

    await enrollment.populate('course');
    res.status(201).json({ success: true, message: `Successfully enrolled in "${course.title}"`, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/enrollments/:courseId - Unenroll from a course
router.delete('/:courseId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled in this course' });

    await enrollment.deleteOne();
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrollmentCount: -1 } });

    res.json({ success: true, message: 'Unenrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/enrollments/my - Get current user's enrollments
router.get('/my/courses', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        select: 'title description instructor category level duration thumbnail rating enrollmentCount'
      })
      .sort({ enrolledAt: -1 });

    const stats = {
      total: enrollments.length,
      active: enrollments.filter(e => e.status === 'active').length,
      completed: enrollments.filter(e => e.status === 'completed').length
    };

    res.json({ success: true, enrollments, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/enrollments/:courseId/progress - Update progress
router.patch('/:courseId/progress', protect, async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    enrollment.progress = progress;
    if (progress === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = Date.now();
    }
    await enrollment.save();

    res.json({ success: true, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/enrollments/all - Admin: all enrollments
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title category')
      .sort({ enrolledAt: -1 });
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
