// Import the required modules
const express = require('express');

// Create an instance of the Express application
const app = express();

// Set the port to the value specified in the environment variable, or default to 3000
const port = process.env.PORT || 3000;

// Set the host to the value specified in the environment variable, or default to 'localhost'
const host = process.env.HOST || 'localhost';

// Import the routes for views and API
const viewsRoutes = require('./Routes/views');
const apiRoutes = require('./Routes/api');

// Use the views routes for the root path
app.use('/', viewsRoutes);

// Use the API routes for the '/api' path
app.use('/api', apiRoutes);

// Start the server and listen on the specified port and host
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

// End of the code
