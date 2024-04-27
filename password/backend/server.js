require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const shareRequestRoutes = require('./routes/shareRequestRoutes');
const { authenticateToken } = require('./authMiddleware');
const path = require('path');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes configuration
app.use('/api/users', userRoutes);
app.use('/api/passwords', authenticateToken, passwordRoutes);
app.use('/api/share-requests', authenticateToken, shareRequestRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'frontend','build')));
console.log('dirname', __dirname);  

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Handle 404 - Resource not found
app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
