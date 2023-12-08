/**
 * Logs uncaught exceptions and unhandled rejections.
 */
process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

// require
const express = require("express");
const http = require("http");
const https = require("https");
const config = require("./lib/config");
const { auth, rateLimit, compression, body, notFound, internalServerError } = require("./lib/middleware");
require("./lib");
require("./dev");

/**
 * Express application instance.
 */
const app = express();

/**
 * Middleware for Cross-Origin Resource Sharing (CORS).
 */
app.use(require("cors")());

/**
 * Middleware for enhancing app security by setting various HTTP headers.
 */
app.use(require("helmet")());
app.use(auth());
app.use(rateLimit());
app.use(compression());
app.use(body());
app.use("/api", require("./api"));
app.use(notFound());
app.use(internalServerError());

// Server
const httpServer = http.createServer(app);
const httpsServer = https.createServer(config.https.options, app);

// listen
httpServer.listen(config.http.port, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(config.https.port, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
