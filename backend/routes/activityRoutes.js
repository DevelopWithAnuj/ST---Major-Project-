const express = require('express');
const router = express.Router();
const {
    getRecentActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecentActivity);

module.exports = router;
