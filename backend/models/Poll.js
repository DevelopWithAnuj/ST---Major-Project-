const mongoose = require('mongoose');

const pollOptionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        required: true,
        default: 0,
    },
});

const pollSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    question: {
        type: String,
        required: true,
    },
    options: [pollOptionSchema],
    totalVotes: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
