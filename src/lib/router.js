const http = require("http");
const { Readable } = require("stream");

class Router {
    routes = [];

    constructor() {}

    add(method, path, ...middlewares) {
        if (typeof path === "function") {
            middlewares = [path];
            path = "*";
        }

        const [{ routes }] = middlewares;

        if (routes) {
            middlewares = [];
            for (const route of routes) {
                this.add(route.method, path + route.path, ...route.middlewares);
            }
        }

        path = path.replace(/(?!^)\/$/, "");

        const pattern = "^" + path.replace(/:(\w+)/g, "(?<$1>[^/]+)").replace(/\*/, "(?:.*)") + "(?:$)";
        const regexp = new RegExp(pattern, "i");

        this.routes.push({
            method,
            path,
            middlewares,
            regexp,
        });
    }

    use(...args) {
        this.add("", ...args);
    }

    post(...args) {
        this.add("POST", ...args);
    }

    get(...args) {
        this.add("GET", ...args);
    }

    patch(...args) {
        this.add("PATCH", ...args);
    }

    delete(...args) {
        this.add("DELETE", ...args);
    }

    put(...args) {
        this.add("PUT", ...args);
    }

    async handleRequest(req, res) {
        try {
            req.protocol_ = req.socket.encrypted ? "https:" : "http:";
            req.host_ = req.headers.host;
            req.url_ = new URL(req.protocol_ + "//" + req.host_ + req.url);

            req.query = {};
            for (const [name, value] of req.url_.searchParams) {
                if (req.query[name]) {
                    if (Array.isArray(req.query[name])) {
                        req.query[name].push(value);
                    } else {
                        req.query[name] = [req.query[name], value];
                    }
                } else {
                    req.query[name] = value;
                }
            }

            res.send = (body) => {
                if (typeof body === "string") {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);

                    body = readable;
                }

                body.pipe(res);
            };

            res.json = (body) => {
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(body));
            };

            for (const route of this.routes) {
                const matches = req.url_.pathname.match(route.regexp);

                if (!(!!matches && (route.method === req.method || route.method === ""))) {
                    continue;
                }

                req.params = { ...matches?.groups };

                for (const middleware of route.middlewares) {
                    if (req.error_ && middleware.length !== 4) {
                        continue;
                    }

                    try {
                        await new Promise((resolve, reject) => {
                            // handle next
                            const next = (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            };

                            if (req.error_) {
                                middleware(req.error_, req, res, next);
                            } else {
                                middleware(req, res, next);
                            }
                        });
                    } catch (error) {
                        req.error_ = error;
                    }
                }
            }

            res.statusCode = 404;
            res.json({ message: http.STATUS_CODES[res.statusCode] });
        } catch (error) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                res.statusCode = 500;
            }
            error = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            res.json(error);
        }
    }

    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
        return server;
    }
}

module.exports = Router;
