const http = require("http");
const { Readable } = require("stream");
const zlib = require("zlib");
const moment = require("moment");

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

            res.send = function (body) {
                if (!(body instanceof Readable)) {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);
                    body = readable;
                }
                const acceptEncoding = req.headers["accept-encoding"];
                if (/\bgzip\b/.test(acceptEncoding)) {
                    body = body.pipe(zlib.createGzip());
                } else if (/\bdeflate\b/.test(acceptEncoding)) {
                    body = body.pipe(zlib.createDeflate());
                } else if (/\bbr\b/.test(acceptEncoding)) {
                    body = body.pipe(zlib.createBrotliCompress());
                }
                body.pipe(res);
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}

const options = [
    {
        method: /.*/,
        url: /.*/,
        whitelist: [/^(127\.0\.0\.1|10(\.[0-9]{1,3}){3}|192\.168(\.[0-9]{1,3}){2}|172\.(1[6-9]|2[0-9]|3[0-1])(\.[0-9]{1,3}){2})$/],
        limit: 30,
        window: 30,
        roles: [
            {
                role: /.*/,
                POST: "any", //any/own
                GET: "any", //any/own
                PATCH: "any", //any/own
                PUT: "any", //any/own
                DELETE: "any", //any/own
            },
        ],
    },
];
const temp = new Map();

function auth() {
    return (req, res, next) => {
        try {
            req.ip = req.socket.remoteAddress;
            const option = options.find((option) => option.method.test(req.method) && option.url.test(req.url));
            const whitelist = option.whitelist.some((regex) => regex.test(req.ip));
            if (!whitelist) {
                const key = [req.method, req.ip, req.url].join();
                if (!temp.has(key)) {
                    temp.set(key, { remaining: option.limit });
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
                res.set({ "X-RateLimit-Limit": option.limit, "X-RateLimit-Remaining": value.remaining });
                if (retryAfter > 0) {
                    res.set({ "X-RateLimit-Reset": value.reset, "Retry-After": retryAfter });
                    res.status(429);
                    throw new Error(http.STATUS_CODES[429]);
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
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        if (err.statusCode >= 200 && err.statusCode < 300) {
            res.status(500);
        }
        err.stack = undefined;
        res.json(err);
    };
}
module.exports = { auth, body, notFound, internalServerError };
