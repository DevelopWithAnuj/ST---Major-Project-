const asyncHandler = require('express-async-handler');
const WatchProgress = require('../models/WatchProgress');

// @desc    Get watch progress for a user
// @route   GET /api/watchprogress
// @access  Private
const getWatchProgress = asyncHandler(async (req, res) => {
    const watchProgress = await WatchProgress.find({ user: req.user._id }).populate('show', 'title imageUrl');
    res.json(watchProgress);
});

// @desc    Get watch progress for a specific show
// @route   GET /api/watchprogress/:showId
// @access  Private
const getWatchProgressByShowId = asyncHandler(async (req, res) => {
    const watchProgress = await WatchProgress.findOne({ user: req.user._id, show: req.params.showId }).populate('show', 'title imageUrl');

    if (watchProgress) {
        res.json(watchProgress);
    } else {
        res.status(404);
        throw new Error('Watch progress not found for this show');
    }
});

// @desc    Create or update watch progress
// @route   POST /api/watchprogress
// @access  Private
const createOrUpdateWatchProgress = asyncHandler(async (req, res) => {
    const { show, currentEpisode, status } = req.body;

    let watchProgress = await WatchProgress.findOne({ user: req.user._id, show });

    if (watchProgress) {
        // Update existing progress
        watchProgress.currentEpisode = currentEpisode || watchProgress.currentEpisode;
        watchProgress.status = status || watchProgress.status;
        watchProgress.lastWatched = Date.now();

        const updatedWatchProgress = await watchProgress.save();
        res.json(updatedWatchProgress);
    } else {
        // Create new progress
        watchProgress = new WatchProgress({
            user: req.user._id,
            show,
            currentEpisode,
            status,
        });

        const createdWatchProgress = await watchProgress.save();
        res.status(201).json(createdWatchProgress);
    }
});

// @desc    Delete watch progress
// @route   DELETE /api/watchprogress/:id
// @access  Private
const deleteWatchProgress = asyncHandler(async (req, res) => {
    const watchProgress = await WatchProgress.findById(req.params.id);

    if (watchProgress) {
        if (watchProgress.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this watch progress');
        }
        await watchProgress.deleteOne();
        res.json({ message: 'Watch progress removed' });
    } else {
        res.status(404);
        throw new Error('Watch progress not found');
    }
});

module.exports = {
    getWatchProgress,
    getWatchProgressByShowId,
    createOrUpdateWatchProgress,
    deleteWatchProgress,
};
