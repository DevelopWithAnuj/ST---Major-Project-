const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity');

// @desc    Fetch recent activity
// @route   GET /api/activity
// @access  Private
const getRecentActivity = asyncHandler(async (req, res) => {
    // For now, return dummy data
    res.json([
        {
            _id: '1',
            userAvatar: 'assets/profile-pic.png',
            message: 'User started watching Attack on Titan.',
            timestamp: new Date(),
        },
        {
            _id: '2',
            userAvatar: 'assets/profile-pic.png',
            message: 'User completed Jujutsu Kaisen.',
            timestamp: new Date(),
        },
        {
            _id: '3',
            userAvatar: 'assets/profile-pic.png',
            message: 'User added Demon Slayer to their list.',
            timestamp: new Date(),
        },
    ]);
});

module.exports = {
    getRecentActivity,
};
