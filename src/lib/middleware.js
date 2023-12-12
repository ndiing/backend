const http = require("http");
const { Readable } = require("stream");
const zlib = require("zlib");
const moment = require("moment");
const { Headers } = require("./fetch");
const JWT = require("./jwt");
const config = require("./config");
const Crypto = require("./crypto");
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

/**
 * Initializes middleware functions for HTTP request and response handling.
 * @returns {Function} - The initialized middleware function.
 */
function init() {
    return async (req, res, next) => {
        try {
            req.secure = req.socket.encrypted;
            const upgradeInsecureRequests = req.headers["upgrade-insecure-requests"];
            if (upgradeInsecureRequests && !req.secure) {
                res.status(302)
                return res.redirect("https://" + req.hostname + req.url);
            }
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
            res.headers = new Headers(res.headers);
            res.set({
                "Content-Security-Policy": "default-src 'self'",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "X-XSS-Protection": "1; mode=block",
                "Access-Control-Allow-Origin": "*",
            });
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

/**
 * Provides authentication based on specified options.
 * @returns {Function} - The authentication middleware function.
 */
function auth() {
    const options = [
        {
            method: /.*/,
            url: /.*/,
            whitelist: [/^(?:127\.0\.0\.1)|(?:10\.(\d{1,3})\.(\d{1,3})\.(\d{1,3}))|(?:192\.168\.(\d{1,3})\.(\d{1,3}))|(?:172\.(?:1[6-9]|2[0-9]|3[0-1])\.(\d{1,3})\.(\d{1,3}))$/],
            roles: [
                {
                    role: /.*/,
                    scheme: /.*/,
                    POST: "any",
                    GET: "any",
                    PATCH: "any",
                    DELETE: "any",
                    PUT: "any",
                    limit: 30,
                    window: 30,
                },
            ],
        },
    ];
    const temp = new Map();
    return (req, res, next) => {
        try {
            const option = options.find((option) => option.method.test(req.method) && option.url.test(req.url));
            const whitelist = option.whitelist.some((regex) => regex.test(req.ip));
            if (!whitelist) {
                const [scheme, token] = (req.headers["authorization"] || "").split(" ");
                if (token == undefined) {
                    res.status(401);
                    res.set("WWW-Authenticate", 'Basic realm=<realm>, charset="UTF-8"');
                    throw new Error(http.STATUS_CODES[401]);
                }
                let payload;
                try {
                    payload = JWT.decode(token, { secret: { key: config.https.options.key } });
                } catch (error) {
                    res.status(401);
                    throw error;
                }
                const role = option.roles.find((role) => role.role.test(payload.role));
                if (role[req.method] === undefined) {
                    res.status(403);
                    throw new Error(http.STATUS_CODES[403]);
                }
                if (role.limit !== undefined) {
                    const key = [req.method, req.ip, req.url].join();
                    let value = temp.get(key);
                    if (value == undefined || (value.date && moment() > value.date)) {
                        value = { remaining: role.limit, date: undefined };
                        temp.set(key, value);
                    }
                    if (value.remaining > 0) {
                        --value.remaining;
                        temp.set(key, value);
                    }
                    res.set({
                        "X-RateLimit-Limit": role.limit,
                        "X-RateLimit-Remaining": value.remaining,
                    });
                    if (value.remaining <= 0 && value.date === undefined) {
                        value.date = moment().add(role.window, "s");
                        temp.set(key, value);
                    }
                    if (value.date) {
                        res.set({
                            "X-RateLimit-Reset": value.date.utc(),
                            "Retry-After": value.date.diff(moment(), "s"),
                        });
                        res.status(429);
                        throw new Error(http.STATUS_CODES[429]);
                    }
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware to handle missing routes or endpoints.
 * @returns {Function} - The missing endpoint handler middleware.
 */
function missing() {
    return (req, res, next) => {
        res.status(404);
        next(new Error(http.STATUS_CODES[404]));
    };
}

/**
 * Middleware to handle errors within the application.
 * @returns {Function} - The error handler middleware.
 */
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
