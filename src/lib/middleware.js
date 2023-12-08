const http = require("http");
const { Readable } = require("stream");
const zlib = require("zlib");
const moment = require("moment");
const { Headers } = require("./fetch");

const COOKIE_ATTRIBUTES = {
    domain: "Domain",
    expires: "Expires",
    httpOnly: "HttpOnly",
    maxAge: "Max-Age",
    partitioned: "Partitioned",
    path: "Path",
    secure: "Secure",
    sameSite: "SameSite",
};

function init() {
    return async (req, res, next) => {
        try {
            req.secure = req.socket.encrypted;

            // if (!req.secure) {
            //     return res.redirect("https://" + req.hostname + req.url);
            // }

            // HTTP Messages
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

            // HTTP cookies
            const cookie = req.headers["cookie"];
            if (cookie) {
                req.cookies = Object.fromEntries(Array.from(cookie.matchAll(/([^= ]+)=([^;]+)/g), ([, name, value]) => [name, value]));
            }

            res.cookie = (name, value, options = {}) => {
                const array = [];
                array.push([name, value].join("="));
                for (const name in options) {
                    const value = options[name];
                    array.push([COOKIE_ATTRIBUTES[name], value].join("="));
                }
                const cookie = array.join("; ");
                res.headers.append("Set-Cookie", cookie);
            };

            res.removeHeader("X-Powered-By");

            // HTTP headers
            res.headers = new Headers(res.headers);

            // HTTP security
            res.set({
                "Content-Security-Policy": "default-src 'self'",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "X-XSS-Protection": "1; mode=block",
                "Access-Control-Allow-Origin": "*",
            });

            // HTTP compression
            res.send = (body) => {
                if (!(body instanceof Readable)) {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);
                    body = readable;
                }

                const acceptEncoding = req.headers["accept-encoding"];
                if (/\bgzip\b/.test(acceptEncoding)) {
                    res.set("Content-Encoding", "gzip");
                    body = body.pipe(zlib.createGzip());
                } else if (/\bdeflate\b/.test(acceptEncoding)) {
                    res.set("Content-Encoding", "deflate");
                    body = body.pipe(zlib.createDeflate());
                } else if (/\bbr\b/.test(acceptEncoding)) {
                    res.set("Content-Encoding", "br");
                    body = body.pipe(zlib.createBrotliCompress());
                }

                res.set(res.headers);

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
                POST: "any",
                GET: "any",
                PATCH: "any",
                PUT: "any",
                DELETE: "any",
            },
        ],
    },
];
const temp = new Map();

function auth() {
    return (req, res, next) => {
        try {
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
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

function missing() {
    return (req, res, next) => {
        res.status(404);
        next(new Error(http.STATUS_CODES[404]));
    };
}

function error() {
    return (err, req, res, next) => {
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        err.stack = undefined;

        if (err.statusCode >= 200 && err.statusCode < 300) {
            res.status(500);
        }

        res.json(err);
    };
}
module.exports = { auth, init, missing, error };
