const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// Helper function to calculate acceptance rate
const calculateAcceptanceRate = (submissions) => {
  if (submissions.length === 0) return 0;
  const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
  return Math.round((acceptedCount / submissions.length) * 100);
};

// GET /api/user/stats - Get user problem stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Total problems solved
    const user = await User.findById(userId).populate('solvedProblems');
    const totalSolved = user.problemsSolved;

    // Total problems available
    const totalProblems = await Problem.countDocuments();

    // Solved by difficulty
    const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
    user.solvedProblems.forEach(problem => {
      if (problem.difficulty in solvedByDifficulty) {
        solvedByDifficulty[problem.difficulty]++;
      }
    });

    // Acceptance rate (all submissions by user)
    const submissions = await Submission.find({ userId });
    const acceptanceRate = calculateAcceptanceRate(submissions);

    res.json({
      success: true,
      totalSolved,
      totalProblems,
      solvedByDifficulty,
      acceptanceRate
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/user/submissions/recent - Get recent submissions
router.get('/submissions/recent', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.query;

    const query = { userId };
    if (problemId) {
      query.problemId = problemId;
    }

    const recentSubmissions = await Submission.find(query)
      .sort({ submissionTime: -1 })
      .limit(10)
      .populate('problemId', 'title')
      .select('status language submissionTime code');

    res.json({
      success: true,
      recentSubmissions
    });
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/user/activity - Get daily activity for heatmap
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate submissions by date
    const activity = await Submission.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$submissionTime" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error fetching activity data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/user/charts - Get data for pie and bar charts
router.get('/charts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Pie chart data: solved problems by difficulty
    const user = await User.findById(userId).populate('solvedProblems');
    const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
    user.solvedProblems.forEach(problem => {
      if (problem.difficulty in solvedByDifficulty) {
        solvedByDifficulty[problem.difficulty]++;
      }
    });

    // Bar chart data: submissions over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const submissionsOverTime = await Submission.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), submissionTime: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$submissionTime" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      pieChartData: solvedByDifficulty,
      barChartData: submissionsOverTime
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// (Optional) GET /api/user/ranking - Get user global rank and percentile
router.get('/ranking', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users sorted by problemsSolved descending
    const users = await User.find().sort({ problemsSolved: -1 }).select('_id problemsSolved');

    const totalUsers = users.length;
    const userIndex = users.findIndex(u => u._id.equals(userId));

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const rank = userIndex + 1;
    const percentile = Math.round(((totalUsers - userIndex) / totalUsers) * 100);

    res.json({
      success: true,
      rank,
      percentile
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
