// Routes/api.js

const express = require('express');
const router = express.Router();

// Import the HelloWorld controller
const helloWorldController = require('../Controllers/HelloWorld');


// Define a sample API route using the controller
router.get('/', helloWorldController.getHelloWorld);

// Define other API routes as needed

module.exports = router;
