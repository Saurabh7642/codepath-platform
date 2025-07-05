const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const Testcase = require('../models/Testcase');
const User = require('../models/User');

const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Get total count of problems
router.get('/total-count', async (req, res) => {
  try {
    const totalProblems = await Problem.countDocuments();
    res.json({ success: true, totalProblems });
  } catch (error) {
    console.error('Error fetching total problems count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find()
      .select('title slug difficulty tags')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      problems
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching problems'
    });
  }
});

// Get single problem by slug with testcases
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const testcases = await Testcase.find({ problemId: problem._id }).select('-__v -problemId');

    res.json({
      success: true,
      problem,
      testcases
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching problem'
    });
  }
});

// Create a new problem (admin only) with testcases
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, description, difficulty, tags, constraints, examples, testcases } = req.body;

    const existingProblem = await Problem.findOne({ slug });
    if (existingProblem) {
      return res.status(400).json({
        success: false,
        message: 'Problem with this slug already exists'
      });
    }

    const newProblem = new Problem({
      title,
      slug,
      description,
      difficulty,
      tags,
      constraints,
      examples
    });

    await newProblem.save();

    if (testcases && Array.isArray(testcases)) {
      const testcaseDocs = testcases.map(tc => ({
        problemId: newProblem._id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isSample: tc.isSample || false
      }));
      await Testcase.insertMany(testcaseDocs);
    }

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      problem: newProblem
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating problem'
    });
  }
});

// Update a problem by slug (admin only) with testcases
router.put('/:slug', adminMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, tags, constraints, examples, testcases } = req.body;

    const updatedProblem = await Problem.findOneAndUpdate(
      { slug: req.params.slug },
      { title, description, difficulty, tags, constraints, examples },
      { new: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    if (testcases && Array.isArray(testcases)) {
      await Testcase.deleteMany({ problemId: updatedProblem._id });

      const testcaseDocs = testcases.map(tc => ({
        problemId: updatedProblem._id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isSample: tc.isSample || false
      }));
      await Testcase.insertMany(testcaseDocs);
    }

    res.json({
      success: true,
      message: 'Problem updated successfully',
      problem: updatedProblem
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating problem'
    });
  }
});

// Delete a problem by using slug (admin only)
router.delete('/:slug', adminMiddleware, async (req, res) => {
  try {
    const deletedProblem = await Problem.findOneAndDelete({ slug: req.params.slug });

    if (!deletedProblem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    await Testcase.deleteMany({ problemId: deletedProblem._id });

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting problem'
    });
  }
});

// Update user's solved problems after accepted submission
router.post('/submit/:problemId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const problemId = req.params.problemId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.solvedProblems.includes(problemId)) {
      user.solvedProblems.push(problemId);
      user.problemsSolved = user.solvedProblems.length;
      await user.save();
    }

    res.json({
      success: true,
      message: 'User solved problems updated'
    });
  } catch (error) {
    console.error('Error updating user solved problems:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user solved problems'
    });
  }
});

module.exports = router;
