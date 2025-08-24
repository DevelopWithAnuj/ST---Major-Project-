const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('members', 'name');
    res.json(clubs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get recent clubs
// @route   GET /api/clubs/recent
// @access  Public
exports.getRecentClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 }).limit(5).populate('members', 'name');
    res.json(clubs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single club
// @route   GET /api/clubs/:id
// @access  Public
exports.getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('members', 'name');
    if (!club) {
      return res.status(404).json({ msg: 'Club not found' });
    }
    res.json(club);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private
exports.createClub = async (req, res) => {
  const { name, description } = req.body;

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newClub = new Club({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    const club = await newClub.save();

    res.json(club);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Join a club
// @route   PUT /api/clubs/:id/join
// @access  Private
exports.joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    // Check if the user is already a member
    if (club.members.some((member) => member.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Already a member' });
    }

    club.members.push(req.user.id);

    await club.save();

    res.json(club.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
