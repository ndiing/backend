const http = require("http");
const https = require("https");
const { Readable } = require("stream");
const zlib = require("zlib");
const { Blob } = require("buffer");
const { read, write } = require("./file");
const { HttpProxyAgent } = require("http-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

const HTTP_HEADERS = ["Accept", "Accept-CH", "Accept-CH-Lifetime", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Accept-Patch", "Accept-Post", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Disposition", "Content-DPR", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Critical-CH", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Digest", "Deprecated", "DNT", "Downlink", "DPR", "Early-Data", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Large-Allocation", "Last-Modified", "Link", "Location", "Max-Forwards", "NEL", "Origin", "Origin-Agent-Cluster", "Permissions-Policy", "Pragma", "Deprecated", "Proxy-Authenticate", "Proxy-Authorization", "Range", "Referer", "Referrer-Policy", "Retry-After", "RTT", "Save-Data", "Sec-CH-Prefers-Color-Scheme", "Sec-CH-Prefers-Reduced-Motion", "Sec-CH-Prefers-Reduced-Transparency", "Sec-CH-UA", "Sec-CH-UA-Arch", "Sec-CH-UA-Bitness", "Sec-CH-UA-Full-Version", "Deprecated", "Sec-CH-UA-Full-Version-List", "Sec-CH-UA-Mobile", "Sec-CH-UA-Model", "Sec-CH-UA-Platform", "Sec-CH-UA-Platform-Version", "Sec-Fetch-Dest", "Sec-Fetch-Mode", "Sec-Fetch-Site", "Sec-Fetch-User", "Sec-GPC", "Sec-Purpose", "Sec-WebSocket-Accept", "Server", "Server-Timing", "Service-Worker-Navigation-Preload", "Set-Cookie", "SourceMap", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Tk", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "Viewport-Width", "Want-Digest", "Deprecated", "Warning", "Deprecated", "Width", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Proto", "X-Frame-Options", "X-XSS-Protection"];

/**
 * Represents HTTP headers.
 */
class Headers {
    constructor(init) {
        if (init) {
            for (const name in init) {
                const value = init[name];
                this.set(name, value);
            }
        }
    }
    append(name, value) {
        name = this.key(name);
        if (this[name]) {
            if (Array.isArray(this[name])) {
                this[name].push(value);
            } else {
                this[name] = [this[name], value];
            }
        } else {
            this[name] = value;
        }
    }
    delete(name) {
        name = this.key(name);
        delete this[name];
    }
    entries() {
        return Object.fromEntries(this);
    }
    forEach(callback) {
        for (const [name, value] of Object.fromEntries(this)) {
            callback(value, name);
        }
    }
    get(name) {
        name = this.key(name);
        return this[name];
    }
    getSetCookie() {
        let name = "Set-Cookie";
        name = this.key(name);
        return [].concat(this[name]).filter(Boolean);
    }
    has(name) {
        name = this.key(name);
        return !!this[name];
    }
    keys() {
        return Object.keys(this);
    }
    key(name) {
        return HTTP_HEADERS.find((key) => new RegExp(`^${name}$`, "i").test(key)) ?? name;
    }
    set(name, value) {
        name = this.key(name);
        this[name] = value;
    }
    values() {
        return Object.values(this);
    }
}

/**
 * Represents an HTTP request.
 */
class Request {
    constructor(input, options = {}) {
        input = new URL(input);
        this.protocol = input.protocol;
        this.hostname = input.hostname;
        this.port = parseInt(input.port || (this.protocol === "https:" ? 443 : 80));
        this.host = input.host;
        this.origin = input.origin;
        this.path = input.pathname + input.search + input.hash;
        this.client = this.protocol === "https:" ? https : http;
        this.agent = options.agent ?? new this.client.Agent({ keepAlive: true });
        this.insecureHTTPParser = options.insecureHTTPParser ?? true;
        this.timeout = options.timeout ?? 1000 * 30;
        this.body = options.body ?? "";
        if (!(this.body instanceof Readable)) {
            const readable = new Readable();
            readable.push(this.body);
            readable.push(null);
            this.body = readable;
        }
        this.credentials = options.credentials ?? "include";
        this.headers = new Headers({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36", Connection: "Keep-Alive", ...options.headers });
        this.method = options.method ?? "GET";
        this.redirect = options.redirect ?? "follow";
        this.follow = options.follow ?? 30;
        this.signal = options.signal;
        this.url = options.url;
    }
    arrayBuffer() {}
    blob() {}
    clone() {}
    formData() {}
    json() {}
    text() {}
}

/**
 * Represents an HTTP response.
 */
class Response {
    constructor(body, options = {}) {
        this.body = body;
        this.headers = new Headers(options.headers);
        const contentEncoding = this.headers.get("Content-Encoding");
        if (/\bgzip\b/.test(contentEncoding)) {
            this.body = this.body.pipe(zlib.createGunzip());
        } else if (/\bdeflate\b/.test(contentEncoding)) {
            this.body = this.body.pipe(zlib.createInflate());
        } else if (/\bbr\b/.test(contentEncoding)) {
            this.body = this.body.pipe(zlib.createBrotliDecompress());
        }
        this.status = options.status ?? options.statusCode;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText ?? options.statusMessage;
        this.url = options.url;
    }
    static error() {}
    static json() {}
    static redirect() {}
    async buffer() {
        const buffer = [];
        for await (const chunk of this.body) {
            buffer.push(chunk);
        }
        return Buffer.concat(buffer);
    }
    async arrayBuffer() {
        const buffer = await this.buffer();
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }
    async blob() {
        const buffer = await this.buffer();
        return new Blob([buffer]);
    }
    async clone() {
        const buffer = await this.buffer();
        return Buffer.from(buffer);
    }
    async json() {
        const buffer = await this.buffer();
        return JSON.parse(buffer);
    }
    async text() {
        const buffer = await this.buffer();
        return buffer.toString();
    }
}

/**
 * Represents a store for cookies.
 */
class CookieStore {
    constructor(init) {
        if (init) {
            for (const name in init) {
                const cookie = init[name];
                this.set(cookie);
            }
        }
    }
    delete(name) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name };
        }
        delete this[cookie.name];
    }
    get(name) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name };
        }
        return this[cookie.name];
    }
    getAll(name) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name };
        }
        return [this[cookie.name]];
    }
    set(name, value) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name, value };
        }
        this[cookie.name] = cookie;
    }
    get cookie() {
        const array = [];
        for (const name of Object.getOwnPropertyNames(this)) {
            const value = this[name].value;
            array.push([name, value].join("="));
        }
        return array.join("; ");
    }
    set cookie(value) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        const regex = /(Domain|Expires|HttpOnly|Max-Age|Partitioned|Path|Secure|SameSite)/i;
        for (const string of value) {
            for (const [, name, value] of string.matchAll(/([^= ]+)=([^;]+)/g)) {
                if (regex.test(name)) {
                    continue;
                }
                if (value) {
                    this.set(name, value);
                } else {
                    this.delete(name);
                }
            }
        }
    }
}

/**
 * Represents a data store.
 */
class Store {
    constructor(file, data = {}) {
        this.file = file;
        this.data = read(this.file, data);
        this.data.cookieStore = new CookieStore(this.data.cookieStore);
        return new Proxy(this.data, this);
    }
    get(target, name) {
        if (["[object Array]", "[object Object]"].includes(toString.call(target[name]))) {
            return new Proxy(target[name], this);
        }
        return target[name];
    }
    set(target, name, value) {
        const oldValue = target[name];
        if (oldValue === value) {
            return true;
        }
        Reflect.set(target, name, value);
        write(this.file, this.data);
        return true;
    }
    deleteProperty(target, name) {
        const oldValue = target[name];
        if (oldValue === undefined) {
            return true;
        }
        Reflect.deleteProperty(target, name);
        write(this.file, this.data);
        return true;
    }
}

/**
 * Makes an HTTP request.
 *
 * @param {string} resource - The resource URL.
 * @param {Object} [options={}] - Additional options for the request.
 * @returns {Promise<Response>} The response from the server.
 */
function fetch(resource, options = {}) {
    return new Promise((resolve, reject) => {
        const request = new Request(resource, options);

        if (!options.store) {
            options.store = new Store(`./data/${request.hostname}/default.min.json`);
        }

        const cookie = options.store.cookieStore.cookie;
        if (cookie && request.credentials === "includes") {
            request.headers.set("Cookie", cookie);
        }

        if (process.env.NODE_ENV === "development") {
            const Agent = request.protocol === "https:" ? HttpsProxyAgent : HttpProxyAgent;
            request.agent = new Agent("http://127.0.0.1:8888");
        }

        const req = request.client.request(request);
        req.on("error", reject);
        req.on("response", (res) => {
            let response = new Response(res, { statusCode: res.statusCode, statusMessage: res.statusMessage, headers: res.headers });

            const setCookie = response.headers.getSetCookie();
            if (setCookie.length) {
                options.store.cookieStore.cookie = setCookie;
            }

            const location = response.headers.get("Location");
            if (location && request.redirect === "follow" && request.follow > 0) {
                --request.follow;
                const url = new URL(location, request.origin);
                response = fetch(url.toString(), { follow: request.follow, store: options.store });
            }

            resolve(response);
        });
        request.body.pipe(req);
    });
}
module.exports = { default: fetch, Headers, Request, Response, CookieStore, Store };

// // Usage example

// var headers=new Headers()
// console.log(headers)

// var request=new Request('http://google.com')
// console.log(request)

// var response=new Response()
// console.log(response)

// var cookieStore=new CookieStore()
// cookieStore.cookie='name=value'
// console.log(cookieStore)
// console.log(cookieStore.cookie)

// var store = new Store('./data/name/default.json',{})
// // store.name='line1'
// console.log(store)

// fetch('http://google.com')
// .then(res=>res.text())
// .then(console.log)
// .catch(console.log)
