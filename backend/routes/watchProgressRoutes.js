const express = require('express');
const router = express.Router();
const {
    getWatchProgress,
    getWatchProgressByShowId,
    createOrUpdateWatchProgress,
    deleteWatchProgress,
} = require('../controllers/watchProgressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getWatchProgress).post(protect, createOrUpdateWatchProgress);
router.route('/:showId').get(protect, getWatchProgressByShowId);
router.route('/:id').delete(protect, deleteWatchProgress);

module.exports = router;
