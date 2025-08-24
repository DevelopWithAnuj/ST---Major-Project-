const express = require('express');
const router = express.Router();
const {
    getPolls,
    getPollById,
    createPoll,
    votePoll,
    deletePoll,
} = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPolls).post(protect, createPoll);
router.route('/:id').get(getPollById).delete(protect, deletePoll);
router.route('/:id/vote').put(votePoll);

module.exports = router;
