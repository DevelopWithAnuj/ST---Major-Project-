const asyncHandler = require('express-async-handler');
const Poll = require('../models/Poll');

// @desc    Fetch all polls
// @route   GET /api/polls
// @access  Public
const getPolls = asyncHandler(async (req, res) => {
    const polls = await Poll.find({}).populate('user', 'name');
    res.json(polls);
});

// @desc    Fetch single poll
// @route   GET /api/polls/:id
// @access  Public
const getPollById = asyncHandler(async (req, res) => {
    const poll = await Poll.findById(req.params.id).populate('user', 'name');

    if (poll) {
        res.json(poll);
    } else {
        res.status(404);
        throw new Error('Poll not found');
    }
});

// @desc    Create a poll
// @route   POST /api/polls
// @access  Private
const createPoll = asyncHandler(async (req, res) => {
    const { question, options } = req.body;

    const poll = new Poll({
        user: req.user._id,
        question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        totalVotes: 0,
    });

    const createdPoll = await poll.save();
    res.status(201).json(createdPoll);
});

// @desc    Vote on a poll option
// @route   PUT /api/polls/:id/vote
// @access  Public
const votePoll = asyncHandler(async (req, res) => {
    const { optionId } = req.body;

    const poll = await Poll.findById(req.params.id);

    if (poll) {
        const option = poll.options.id(optionId);

        if (option) {
            option.votes += 1;
            poll.totalVotes += 1;
            await poll.save();
            res.json(poll);
        } else {
            res.status(404);
            throw new Error('Option not found');
        }
    } else {
        res.status(404);
        throw new Error('Poll not found');
    }
});

// @desc    Delete a poll
// @route   DELETE /api/polls/:id
// @access  Private
const deletePoll = asyncHandler(async (req, res) => {
    const poll = await Poll.findById(req.params.id);

    if (poll) {
        if (poll.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this poll');
        }
        await poll.deleteOne();
        res.json({ message: 'Poll removed' });
    } else {
        res.status(404);
        throw new Error('Poll not found');
    }
});

module.exports = {
    getPolls,
    getPollById,
    createPoll,
    votePoll,
    deletePoll,
};
