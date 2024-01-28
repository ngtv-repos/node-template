// Routes/views.js

const express = require('express');
const router = express.Router();

// Serve the index.html file for the root path with cache control set to 5 minutes
router.use('/', express.static('Views', { index: 'index.html', maxAge: '5m' }));

// Define other view routes as needed

module.exports = router;
