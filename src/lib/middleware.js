const http = require("http");
const { Readable } = require("stream");
const zlib = require("zlib");
const moment = require("moment");

const options = [
    {
        method: /.*/,
        url: /.*/,
        whitelist: [/^(127\.0\.0\.1|10(\.[0-9]{1,3}){3}|192\.168(\.[0-9]{1,3}){2}|172\.(1[6-9]|2[0-9]|3[0-1])(\.[0-9]{1,3}){2})$/],
        limit: 30,
        window: 30,
    },
];

/**
 * Middleware for authentication.
 * @returns {Function} Middleware function for authentication.
 */
function auth() {
    return (req, res, next) => {
        try {
            req.ip = req.socket.remoteAddress;

            const option = options.find((option) => option.method.test(req.method) && option.url.test(req.url));

            const whitelist = option.whitelist.some((regex) => regex.test(req.ip));

            if (!whitelist) {
                // authorization
                // authentication
            }

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
// This function creates a rate limiter middleware using a Map to track request limits.
function rateLimit() {
    // Create a Map to store temporary data for rate limiting
    const temp = new Map();

    // Return a middleware function that handles rate limiting for incoming requests
    return (req, res, next) => {
        try {
            // Find an option object that matches the request method and URL from a list of options
            const option = options.find((option) => option.method.test(req.method) && option.url.test(req.url));

            // Check if the requester's IP is whitelisted in the found option
            const whitelist = option.whitelist.some((regex) => regex.test(req.ip));

            // If the requester is not whitelisted, apply rate limiting rules
            if (!whitelist) {
                // Create a unique key based on request method, IP, and URL
                const key = [req.method, req.ip, req.url].join();

                // If the key is not in the temporary storage, initialize its data
                if (!temp.has(key)) {
                    temp.set(key, {
                        remaining: option.limit,
                    });
                }

                // Retrieve the stored value for the key
                const value = temp.get(key);

                // Decrement the remaining count of requests allowed for this key
                if (value.remaining > 0) {
                    --value.remaining;
                    temp.set(key, value);
                }

                // If the limit is reached and no reset time is set, calculate and set the reset time
                if (value.remaining === 0 && value.reset === undefined) {
                    value.reset = moment().add(option.window, "s");
                    temp.set(key, value);
                }

                // Calculate time remaining until reset and reset the limit if necessary
                const retryAfter = value.reset && value.reset.diff(moment(), "s");
                if (retryAfter <= 0) {
                    value.remaining = option.limit;
                    value.reset = undefined;
                    temp.set(key, value);
                }

                // Set response headers for rate limit information
                res.set({
                    "X-RateLimit-Limit": option.limit,
                    "X-RateLimit-Remaining": value.remaining,
                });

                // If retryAfter is greater than 0, set headers for retry-after and rate limit reset time,
                // then respond with a 429 status (Too Many Requests)
                if (retryAfter > 0) {
                    res.set({
                        "X-RateLimit-Reset": value.reset,
                        "Retry-After": retryAfter,
                    });
                    res.status(429);
                    throw new Error(http.STATUS_CODES[429]);
                }
            }

            // If the requester is whitelisted or within limits, proceed to the next middleware
            next();
        } catch (error) {
            // Pass any caught error to the next middleware
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
    // Returns an asynchronous middleware function that handles parsing request bodies
    return async (req, res, next) => {
        try {
            // Check if the request method is POST, PATCH, or PUT
            if (["POST", "PATCH", "PUT"].includes(req.method)) {
                const buffer = [];
                // Iterate through the incoming request data (chunks) and store them in a buffer
                for (const chunk of req) {
                    buffer.push(chunk);
                }
                // Concatenate the chunks into a single Buffer representing the entire request body
                const body = Buffer.concat(buffer);

                // Get the content type of the request from the headers
                const contentType = req.headers["content-type"];

                // Check if the content type includes 'json'
                if (contentType.includes("json")) {
                    // If content type is JSON, parse the body as JSON and assign it to req.body
                    req.body = JSON.parse(body);
                } else if (contentType.includes("urlencoded")) {
                    // If content type is URL-encoded, parse the body and convert it into an object
                    req.body = Object.fromEntries(new URLSearchParams(body.toString()).entries());
                }
            }
            // Move to the next middleware in the chain
            next();
        } catch (error) {
            // Pass any caught error to the next middleware for error handling
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

module.exports = {
    auth,
    rateLimit,
    compression,
    body,
    notFound,
    internalServerError,
};
