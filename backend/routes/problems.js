const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const adminMiddleware = require('../middleware/admin');

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

// Get single problem by slug
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    res.json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching problem'
    });
  }
});

// Create a new problem (admin only) very imp after scrum call
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, description, difficulty, tags, constraints, examples } = req.body;

    // Check if slug already exists ,help to avoid duplicate slug
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

// Update a problem by slug (admin only)
router.put('/:slug', adminMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, tags, constraints, examples } = req.body;

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

// Delete a problem by using slug
router.delete('/:slug', adminMiddleware, async (req, res) => {
  try {
    const deletedProblem = await Problem.findOneAndDelete({ slug: req.params.slug });

    if (!deletedProblem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

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

module.exports = router;
