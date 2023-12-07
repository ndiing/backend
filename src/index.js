// prevent error
// logs error
process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

// require
const express = require("express");
const http = require("http");
const https = require("https");
const { Readable } = require("stream");
const zlib = require("zlib");
const moment = require("moment");

// REMOVE IT LATER
require("./lib");
require("./dev");

// options
const options = {
    key: null,
    cert: null,
};

// app
const app = express();

// use
app.use(require("cors")());
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

// function
function auth() {
    return (req, res, next) => {
        try {
            // authentication

            // // authorization
            // res.set("WWW-Authenticate", 'Basic realm=<realm>, charset="UTF-8"');
            // res.status(401);
            // throw new Error(http.STATUS_CODES[401]);

            next();
        } catch (error) {
            next(error);
        }
    };
}
function rateLimit() {
    const rateLimitMaps = new Map();
    const rateLimitOptions = { limit: 30, window: 30 };
    return (req, res, next) => {
        try {
            // ip
            req.ip = req.socket.remoteAddress;

            // key
            const key = [req.method, req.ip, req.url].join();
            if (!rateLimitMaps.has(key)) {
                rateLimitMaps.set(key, {
                    remaining: rateLimitOptions.limit,
                });
            }

            // value
            const value = rateLimitMaps.get(key);

            // remaining
            if (value.remaining > 0) {
                --value.remaining;
                rateLimitMaps.set(key, value);
            }

            // reset
            if (value.remaining === 0 && value.reset === undefined) {
                value.reset = moment().add(rateLimitOptions.window, "s");
                rateLimitMaps.set(key, value);
            }

            // retryAfter
            const retryAfter = value.reset && value.reset.diff(moment(), "s");

            // reset
            if (retryAfter <= 0) {
                value.remaining = rateLimitOptions.limit;
                value.reset = undefined;
                rateLimitMaps.set(key, value);
            }

            // RateLimit
            res.set({
                "X-RateLimit-Limit": rateLimitOptions.limit,
                "X-RateLimit-Remaining": value.remaining,
            });

            // Retry-After
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
function compression() {
    return (req, res, next) => {
        try {
            // headers
            req.headers = new Headers(req.headers);

            // send
            res.send = function (body) {
                // Readable
                if (!(body instanceof Readable)) {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);
                    body = readable;
                }

                // Accept-Encoding
                const acceptEncoding = req.headers.get("Accept-Encoding");

                // Content-Encoding
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
function body() {
    return async (req, res, next) => {
        try {
            if (["POST", "PATCH", "PUT"].includes(req.method)) {
                // buffer
                const buffer = [];
                for (const chunk of req) {
                    buffer.push(chunk);
                }

                // body
                const body = Buffer.concat(buffer);

                // contentType
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
function notFound() {
    return (req, res, next) => {
        res.status(404);
        next(new Error(http.STATUS_CODES[404]));
    };
}
function internalServerError() {
    return (err, req, res, next) => {
        // err
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        if (err.statusCode >= 200 && err.statusCode < 300) {
            res.status(500);
        }

        // delete stack
        err.stack = undefined;
        res.json(err);
    };
}
