const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const commentRoutes = require('./commentRoutes');

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').put(protect, likePost);

router.use('/:postId/comments', commentRoutes);

module.exports = router;
