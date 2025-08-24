const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate('user', 'name');
    res.json(posts);
});

// @desc    Fetch single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('user', 'name');

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { title, image, category, description } = req.body;

    const post = new Post({
        user: req.user._id,
        title,
        image,
        category,
        description,
        likes: 0,
    });

    const createdPost = await post.save();

    res.status(201).json(createdPost);
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
    const { title, image, category, description, likes } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
        post.title = title || post.title;
        post.image = image || post.image;
        post.category = category || post.category;
        post.description = description || post.description;
        post.likes = likes || post.likes;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this post');
        }
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        const alreadyLiked = post.likes.find(
            (like) => like.user.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            // Unlike the post
            post.likes = post.likes.filter(
                (like) => like.user.toString() !== req.user._id.toString()
            );
        } else {
            // Like the post
            post.likes.push({ user: req.user._id });
        }

        await post.save();
        res.json({ likes: post.likes.length });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
};
