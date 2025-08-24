const asyncHandler = require('express-async-handler');
const Show = require('../models/Show');

// @desc    Fetch all shows
// @route   GET /api/shows
// @access  Public
const getShows = asyncHandler(async (req, res) => {
    const shows = await Show.find({});
    res.json(shows);
});

// @desc    Fetch single show
// @route   GET /api/shows/:id
// @access  Public
const getShowById = asyncHandler(async (req, res) => {
    const show = await Show.findById(req.params.id);

    if (show) {
        res.json(show);
    } else {
        res.status(404);
        throw new Error('Show not found');
    }
});

// @desc    Create a show
// @route   POST /api/shows
// @access  Private
const createShow = asyncHandler(async (req, res) => {
    const { title, description, genre, releaseDate, status, episodes, imageUrl, trailerUrl } = req.body;

    const show = new Show({
        title,
        description,
        genre,
        releaseDate,
        status,
        episodes,
        imageUrl,
        trailerUrl,
    });

    const createdShow = await show.save();

    // Create notification for all users
    await createNotificationsForAllUsers(`New show added: ${createdShow.title}!`, 'episode');

    res.status(201).json(createdShow);
});

// @desc    Update a show
// @route   PUT /api/shows/:id
// @access  Private
const updateShow = asyncHandler(async (req, res) => {
    const { title, description, genre, releaseDate, status, episodes, imageUrl, trailerUrl } = req.body;

    const show = await Show.findById(req.params.id);

    if (show) {
        show.title = title || show.title;
        show.description = description || show.description;
        show.genre = genre || show.genre;
        show.releaseDate = releaseDate || show.releaseDate;
        show.status = status || show.status;
        show.episodes = episodes || show.episodes;
        show.imageUrl = imageUrl || show.imageUrl;
        show.trailerUrl = trailerUrl || show.trailerUrl;

        const updatedShow = await show.save();
        res.json(updatedShow);
    } else {
        res.status(404);
        throw new Error('Show not found');
    }
});

// @desc    Delete a show
// @route   DELETE /api/shows/:id
// @access  Private
const deleteShow = asyncHandler(async (req, res) => {
    const show = await Show.findById(req.params.id);

    if (show) {
        await show.deleteOne();
        res.json({ message: 'Show removed' });
    } else {
        res.status(404);
        throw new Error('Show not found');
    }
});

// @desc    Get recommended shows
// @route   GET /api/shows/recommendations
// @access  Private
const getRecommendedShows = asyncHandler(async (req, res) => {
    // For now, return dummy data
    res.json([
        {
            _id: '60d5ec49f8c7a10015a4b3a1',
            title: 'Attack on Titan',
            imageUrl: 'assets/attack_on_titan.png',
            genre: 'Action, Fantasy',
            score: 9.1,
        },
        {
            _id: '60d5ec49f8c7a10015a4b3a2',
            title: 'Jujutsu Kaisen',
            imageUrl: 'assets/JujutsuKaisen.png',
            genre: 'Action, Supernatural',
            score: 8.7,
        },
        {
            _id: '60d5ec49f8c7a10015a4b3a3',
            title: 'Demon Slayer',
            imageUrl: 'assets/demon_slayer.png',
            genre: 'Action, Fantasy',
            score: 8.6,
        },
    ]);
});

module.exports = {
    getShows,
    getShowById,
    createShow,
    updateShow,
    deleteShow,
    getRecommendedShows,
};
