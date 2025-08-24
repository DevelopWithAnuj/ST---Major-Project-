const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: [String],
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Airing', 'Completed', 'Upcoming'],
        default: 'Upcoming',
    },
    episodes: {
        type: Number,
        required: true,
        default: 0,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    trailerUrl: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
