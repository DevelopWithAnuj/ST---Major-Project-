const express = require('express');
const router = express.Router();
const {
    getShows,
    getShowById,
    createShow,
    updateShow,
    deleteShow,
    getRecommendedShows,
} = require('../controllers/showController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getShows).post(protect, createShow);
router.route('/recommendations').get(protect, getRecommendedShows);
router.route('/:id').get(getShowById).put(protect, updateShow).delete(protect, deleteShow);

module.exports = router;
