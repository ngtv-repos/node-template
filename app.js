// Import the required modules
const express = require('express');
const mongoose = require('mongoose');


// Create an instance of the Express application
const app = express();




// Set the port to the value specified in the environment variable, or default to 3000
const port = process.env.PORT || 3000;

// Set the host to the value specified in the environment variable, or default to 'localhost'
const host = process.env.HOST || 'localhost';

// Import the routes for views and API
const viewsRoutes = require('./Routes/views');
const apiRoutes = require('./Routes/api');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Serve static files from the 'Views' directory
app.use(express.static('Views', { maxAge: '5m' }));


// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000, // 10 seconds
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});
// Use the views routes for the root path
app.use('/', viewsRoutes);

// Use the API routes for the '/api' path
app.use('/api', apiRoutes);

// Start the server and listen on the specified port and host
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

// End of the code
