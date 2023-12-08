/**
 * Logs uncaught exceptions and unhandled rejections.
 * This sets up listeners for uncaught exceptions and unhandled rejections and logs them to the console.
 */
process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

// Require necessary modules
const http = require("http");
const https = require("https");
const express = require("express");
const config = require("./lib/config");
const { auth, rateLimit, compression, body, notFound, internalServerError } = require("./lib/middleware");

// Require additional custom modules
require("./lib");
require("./dev");

/**
 * Express application instance.
 * Creates an instance of the Express.js application.
 */
const app = express();

/**
 * Middleware for Cross-Origin Resource Sharing (CORS).
 * Adds Cross-Origin Resource Sharing handling middleware to the Express app.
 */
app.use(require("cors")());

/**
 * Middleware for enhancing app security by setting various HTTP headers.
 * Adds security-related HTTP headers using the 'helmet' middleware.
 */
app.use(require("helmet")());
app.use(auth()); // Custom authentication middleware
app.use(rateLimit()); // Custom rate limiting middleware
app.use(compression()); // Compression middleware for response compression
app.use(body()); // Middleware for parsing request bodies
app.use("/api", require("./api")); // Mounts API routes

app.use(notFound()); // Custom middleware for handling 404 errors
app.use(internalServerError()); // Custom middleware for handling internal server errors

// Server setup
const httpServer = http.createServer(app); // Creates an HTTP server using the Express app
const httpsServer = https.createServer(config.https.options, app); // Creates an HTTPS server using provided options

// Listen for incoming HTTP and HTTPS requests
httpServer.listen(config.http.port, "0.0.0.0", () => {
    console.log(httpServer.address()); // Logs the address the HTTP server is listening on
});
httpsServer.listen(config.https.port, "0.0.0.0", () => {
    console.log(httpsServer.address()); // Logs the address the HTTPS server is listening on
});
