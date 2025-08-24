const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name');
    res.json(comments);
});

// @desc    Create a comment
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (post) {
        const comment = new Comment({
            user: req.user._id,
            post: postId,
            text,
        });

        const createdComment = await comment.save();
        res.status(201).json(createdComment);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
        if (comment.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this comment');
        }
        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

module.exports = {
    getComments,
    createComment,
    deleteComment,
};
