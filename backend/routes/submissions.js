const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { getAiCodeAnalysis } = require('../utils/aiCodeReview');

// POST /api/submissions - Create a new submission and update user stats
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId, status, language, code } = req.body;

    console.log('Received submission creation request:', { userId, problemId, status, language, code });

    if (!problemId || !status || !language || !code) {
      console.log('Missing required fields in submission creation');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create new submission
    const newSubmission = new Submission({
      userId,
      problemId,
      status,
      language,
      code,
      submissionTime: new Date()
    });

    await newSubmission.save();

    console.log('Submission saved:', newSubmission);

    // If accepted, update user's solvedProblems and problemsSolved count
    if (status === 'Accepted') {
      const user = await User.findById(userId);
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
        user.problemsSolved = user.solvedProblems.length;
        await user.save();
        console.log('User solvedProblems updated');
      }
    }

    res.json({ success: true, message: 'Submission recorded successfully' });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/submissions/ai-analysis - Get AI code analysis for submitted code
router.post('/ai-analysis', authMiddleware, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const analysis = await getAiCodeAnalysis(code, language);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error in AI code analysis:', error);
    res.status(500).json({ success: false, message: 'Failed to get AI code analysis' });
  }
});


module.exports = router;