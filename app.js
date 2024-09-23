// app.js
const express = require('express');
const mongoose = require('./config/db');
const vastRoutes = require('./routes/vastRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // To parse JSON request body

// Routes
app.use('/vast', vastRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
