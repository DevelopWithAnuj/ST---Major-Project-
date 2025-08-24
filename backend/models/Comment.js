const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    clubPost: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ClubPost',
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
