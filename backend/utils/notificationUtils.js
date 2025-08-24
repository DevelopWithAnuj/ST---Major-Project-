const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (userId, message, type) => {
    try {
        const notification = new Notification({
            user: userId,
            message,
            type,
        });
        await notification.save();
    } catch (error) {
        console.error(`Error creating notification for user ${userId}:`, error);
    }
};

const createNotificationsForAllUsers = async (message, type) => {
    try {
        const users = await User.find({});
        for (const user of users) {
            await createNotification(user._id, message, type);
        }
    } catch (error) {
        console.error('Error creating notifications for all users:', error);
    }
};

const createNotificationsForClubMembers = async (clubId, message, type) => {
    try {
        const Club = require('../models/Club'); 
        const club = await Club.findById(clubId).populate('members');

        if (club && club.members) {
            for (const member of club.members) {
                await createNotification(member._id, message, type);
            }
        }
    } catch (error) {
        console.error(`Error creating notifications for club ${clubId} members:`, error);
    }
};

module.exports = {
    createNotification,
    createNotificationsForAllUsers,
    createNotificationsForClubMembers,
};
