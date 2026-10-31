const express = require('express');
const app = express();

// Port configuration: use environment variable or fallback to 3000
const PORT = process.env.PORT || 3000;

// 1. GET / - Root welcome message
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Lab 1: Node.js and Express Server!');
});

// 2. GET /about - Student and section details
app.get('/about', (req, res) => {
    res.status(200).json({
        name: 'Naga Manikanta Addaguri',
        registrationNumber: '252U1R9001',
        section: 'CSE – Gen AI',
        course: 'Backend Development Fundamentals',
        institution: 'Aurora',
        faculty: 'Joel Prashanth D'
    });
});

// 3. GET /time - Current server date and time
app.get('/time', (req, res) => {
    res.status(200).json({
        currentTime: new Date().toISOString(),
        timestamp: Date.now()
    });
});

// 4. Unknown routes - 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found on this server`,
        statusCode: 404
    });
});

// Start listening
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});

module.exports = app;
