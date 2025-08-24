const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUserById).put(protect, updateUser).delete(protect, deleteUser);

module.exports = router;
