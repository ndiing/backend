process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

const http = require("http");
const https = require("https");
const express = require("express");
const config = require("./lib/config");
const os = require("os");
const { Headers } = require("./lib/fetch");
const { Readable } = require("stream");
const zlib = require("zlib");
const authController = require("./api/auth/controller");
require("./lib");
require("./dev");

const app = express();

app.use(async (req, res, next) => {
    try {
        req.secure = req.socket.encrypted;

        const upgradeInsecureRequests =
            req.headers["upgrade-insecure-requests"];
        if (upgradeInsecureRequests && !req.secure) {
            res.status(302);
            return res.redirect("https://" + req.hostname + req.url);
        }

        if (["POST", "PATCH", "PUT"].includes(req.method)) {
            const buffer = [];
            for await (const chunk of req) {
                buffer.push(chunk);
            }
            const body = Buffer.concat(buffer);

            const contentType = req.headers["content-type"];
            if (contentType.includes("json")) {
                req.body = JSON.parse(body);
            } else if (contentType.includes("urlencoded")) {
                req.body = Object.fromEntries(
                    new URLSearchParams(body.toString()).entries()
                );
            }
        }

        const headers = new Headers();

        res.removeHeader("X-Powered-By");

        res.set({
            "Content-Security-Policy": "default-src 'self'",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Access-Control-Allow-Origin": "*",
        });

        const cookie = req.headers["cookie"];
        if (cookie) {
            req.cookies = Object.fromEntries(
                Array.from(
                    cookie.matchAll(/([^= ]+)=([^;]+)/g),
                    ([, name, value]) => [name, value]
                )
            );
        }

        res.cookie = (name, value, options = {}) => {
            const array = [];
            array.push([name, value].join("="));
            for (const name in options) {
                const value = options[name];
                array.push([COOKIE_ATTRIBUTES[name], value].join("="));
            }
            headers.append("Set-Cookie", array.join("; "));
        };

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
            
            res.set(headers);
            body.pipe(res);
        };
        next();
    } catch (error) {
        next(error);
    }
});

app.use(authController.init)

app.use("/api", require("./api"));

app.use((req, res, next) => {
    res.status(404);
    next(new Error(http.STATUS_CODES[404]));
});

app.use((err, req, res, next) => {
    err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    console.log(err.stack)
    err.stack = undefined;

    if (err.statusCode >= 200 && err.statusCode < 300) {
        res.status(500);
    }
    res.json(err);
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(config.https.options, app);

httpServer.listen(config.http.port, "0.0.0.0", () => {
    console.log(httpServer.address());
});

httpsServer.listen(config.https.port, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
