// Routes/views.js

const express = require('express');
const router = express.Router();

// Serve the index.html file for the root path with cache control set to 5 minutes
router.use('/', express.static('Views', { index: 'index.html', maxAge: '5m' }));
router.use('/dashboard', (req, res) => {
    // get cookies from browser
    console.log(req.cookies);

    // get the cookie named "page"
    console.log(req.cookies.page);

    let page = req.cookies.page;
// Based on the value of the cookie, handle the request accordingly
if (page === "Partner") {
    console.log("Partner");
    res.sendFile('dashboard-partner.html', { root: 'Views' });
} else if (page === "dsa") {
    res.sendFile('dashboard-dsa.html', { root: 'Views' });
} else if (page === "agents") {
    res.sendFile('dashboard-agent.html', { root: 'Views' });
} else if (page === "superadmin") {
    res.sendFile('dashboard-superadmin.html', { root: 'Views' });
} else {
    // If the cookie value doesn't match any case, serve 'index.html'
    // res.sendFile('index.html', { root: 'Views' });
    // redirect to login
    res.redirect('/');
}
});

// Define other view routes as needed

module.exports = router;
