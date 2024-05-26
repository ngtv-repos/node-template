// Routes/api.js

const express = require('express');
const router = express.Router();

// Import the HelloWorld controller
const helloWorldController = require('../Controllers/HelloWorld');
const accountsAPIRoutes = require('./Subroutes/accounts');
const leadsAPIRoutes = require('./Subroutes/leads');


// Define a sample API route using the controller
router.get('/', helloWorldController.getHelloWorld);

// Define a subroute for the accounts API
router.use('/accounts', accountsAPIRoutes);

// Define a subroute for the leads API
router.use('/leads', leadsAPIRoutes);

// Define other API routes as needed

module.exports = router;
