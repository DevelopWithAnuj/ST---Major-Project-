const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getComments,
    createComment,
    deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getComments).post(protect, createComment);
router.route('/:id').delete(protect, deleteComment);

module.exports = router;
