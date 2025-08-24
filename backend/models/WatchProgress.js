const mongoose = require('mongoose');

const watchProgressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Show',
    },
    currentEpisode: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
        default: 'Plan to Watch',
    },
    lastWatched: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const WatchProgress = mongoose.model('WatchProgress', watchProgressSchema);

module.exports = WatchProgress;
