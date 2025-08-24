const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const path = require('path');

app.use(express.json());

// Server frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'welcome.html'));
});

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const pollRoutes = require('./routes/pollRoutes');
const showRoutes = require('./routes/showRoutes');
const clubRoutes = require('./routes/clubRoutes');
const watchProgressRoutes = require('./routes/watchProgressRoutes');
const activityRoutes = require('./routes/activityRoutes');



app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/watchprogress', watchProgressRoutes);
app.use('/api/activity', activityRoutes);

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
