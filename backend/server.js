require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const showRoutes = require('./routes/showRoutes');
const watchProgressRoutes = require('./routes/watchProgressRoutes');
const clubRoutes = require('./routes/clubRoutes');
const pollRoutes = require('./routes/pollRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityRoutes = require('./routes/activityRoutes'); // Add this line
const { getRecommendedShows } = require('./controllers/showController');
const { protect } = require('./middleware/authMiddleware');

const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/watchprogress', watchProgressRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes); // Add this line

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
