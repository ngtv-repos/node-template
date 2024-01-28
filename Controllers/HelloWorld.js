/**
 * Responds with a JSON object containing the message "Hello, World!".
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
function getHelloWorld(req, res) {
    // Extract request details
    const requestDetails = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body
    };

    // Create a message object
    const message = {
        message: "Hello, World!"
    };

    // Send the message as JSON
    res.json({
        ...requestDetails,
        ...message
    });
}


module.exports = {
    getHelloWorld,
};
