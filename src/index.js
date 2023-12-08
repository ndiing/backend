/**
 * Logs uncaught exceptions and unhandled rejections.
 */
process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

// require
const express = require("express");
const http = require("http");
const https = require("https");
const { Readable } = require("stream");
const zlib = require("zlib");
const moment = require("moment");
require("./lib");
require("./dev");

/**
 * SSL key and certificate options.
 * @typedef {Object} Options
 * @property {string | Buffer | Array<string | Buffer>} [key] - SSL key.
 * @property {string | Buffer | Array<string | Buffer>} [cert] - SSL certificate.
 */
const options = {
    key: null,
    cert: null,
};

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
const httpsServer = https.createServer(options, app);

// listen
httpServer.listen(80, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(443, "0.0.0.0", () => {
    console.log(httpsServer.address());
});

/**
 * Middleware for authentication.
 * @returns {Function} Middleware function for authentication.
 */
function auth() {
    return (req, res, next) => {
        try {
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware for rate limiting requests.
 * @returns {Function} Middleware function for rate limiting.
 */
function rateLimit() {
    const temp = new Map();
    const options = [
        {
            url: /.*/,
            limit: 30,
            window: 30,
        },
    ];
    return (req, res, next) => {
        try {
            req.ip = req.socket.remoteAddress;
            const option = options.find((option) => option.url.test(req.url));
            const key = [req.method, req.ip, req.url].join();
            if (!temp.has(key)) {
                temp.set(key, {
                    remaining: option.limit,
                });
            }
            const value = temp.get(key);
            if (value.remaining > 0) {
                --value.remaining;
                temp.set(key, value);
            }
            if (value.remaining === 0 && value.reset === undefined) {
                value.reset = moment().add(option.window, "s");
                temp.set(key, value);
            }
            const retryAfter = value.reset && value.reset.diff(moment(), "s");
            if (retryAfter <= 0) {
                value.remaining = option.limit;
                value.reset = undefined;
                temp.set(key, value);
            }
            res.set({
                "X-RateLimit-Limit": option.limit,
                "X-RateLimit-Remaining": value.remaining,
            });
            if (retryAfter > 0) {
                res.set({
                    "X-RateLimit-Reset": value.reset,
                    "Retry-After": retryAfter,
                });
                res.status(429);
                throw new Error(http.STATUS_CODES[429]);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware for compressing HTTP responses.
 * @returns {Function} Middleware function for compression.
 */
function compression() {
    return (req, res, next) => {
        try {
            req.headers = new Headers(req.headers);
            res.send = function (body) {
                if (!(body instanceof Readable)) {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);
                    body = readable;
                }
                const acceptEncoding = req.headers.get("Accept-Encoding");
                if (/\bgzip\b/.test(acceptEncoding)) {
                    body = body.pipe(zlib.createGzip());
                    res.set("Content-Encoding", "gzip");
                } else if (/\bdeflate\b/.test(acceptEncoding)) {
                    body = body.pipe(zlib.createDeflate());
                    res.set("Content-Encoding", "deflate");
                } else if (/\bbr\b/.test(acceptEncoding)) {
                    body = body.pipe(zlib.createBrotliCompress());
                    res.set("Content-Encoding", "br");
                }
                body.pipe(res);
            };
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware for parsing request body.
 * @returns {Function} Middleware function for handling request body.
 */
function body() {
    return async (req, res, next) => {
        try {
            if (["POST", "PATCH", "PUT"].includes(req.method)) {
                const buffer = [];
                for (const chunk of req) {
                    buffer.push(chunk);
                }
                const body = Buffer.concat(buffer);
                const contentType = req.headers["content-type"];
                if (contentType.includes("json")) {
                    req.body = JSON.parse(body);
                } else if (contentType.includes("urlencoded")) {
                    req.body = Object.fromEntries(new URLSearchParams(body.toString()).entries());
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware for handling 404 (Not Found) errors.
 * @returns {Function} Middleware function for handling 404 errors.
 */
function notFound() {
    return (req, res, next) => {
        res.status(404);
        next(new Error(http.STATUS_CODES[404]));
    };
}

/**
 * Middleware for handling internal server errors.
 * @returns {Function} Middleware function for handling internal server errors.
 */
function internalServerError() {
    return (err, req, res, next) => {
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        if (err.statusCode >= 200 && err.statusCode < 300) {
            res.status(500);
        }
        err.stack = undefined;
        res.json(err);
    };
}
