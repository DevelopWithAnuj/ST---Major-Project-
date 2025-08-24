const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const auth = require('../middleware/auth');

// @route   GET api/clubs
// @desc    Get all clubs
// @access  Public
router.get('/', clubController.getClubs);

// @route   GET api/clubs/recent
// @desc    Get recent clubs
// @access  Public
router.get('/recent', clubController.getRecentClubs);

// @route   GET api/clubs/:id
// @desc    Get single club
// @access  Public
router.get('/:id', clubController.getClub);

// @route   POST api/clubs
// @desc    Create a club
// @access  Private
router.post('/', auth, clubController.createClub);

// @route   PUT api/clubs/:id/join
// @desc    Join a club
// @access  Private
router.put('/:id/join', auth, clubController.joinClub);

module.exports = router;
