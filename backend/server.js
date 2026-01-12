const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/offres', require('./routes/offreRoutes'));
app.use('/api/evenements', require('./routes/evenementRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/groupes', require('./routes/groupeRoutes'));
app.use('/api/friends', require('./routes/amiRoutes'));
app.use('/api/admin', require('./routes/dashboardRoutes'));
app.use('/api/partners', require('./routes/partenaireRoutes'));
app.use('/api/candidatures', require('./routes/candidatureRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Backend is running' }));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});