const http = require("http");
const https = require("https");
const { Readable } = require("stream");
const zlib = require("zlib");
const { Blob } = require("buffer");
const { read, write } = require("./file");
const { HttpProxyAgent } = require("http-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

const HEADERS = ["Accept", "Accept-CH", "Accept-CH-Lifetime", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Accept-Patch", "Accept-Post", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Disposition", "Content-DPR", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Critical-CH", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Digest", "Deprecated", "DNT", "Downlink", "DPR", "Early-Data", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Large-Allocation", "Last-Modified", "Link", "Location", "Max-Forwards", "NEL", "Origin", "Origin-Agent-Cluster", "Permissions-Policy", "Pragma", "Deprecated", "Proxy-Authenticate", "Proxy-Authorization", "Range", "Referer", "Referrer-Policy", "Retry-After", "RTT", "Save-Data", "Sec-CH-Prefers-Color-Scheme", "Sec-CH-Prefers-Reduced-Motion", "Sec-CH-Prefers-Reduced-Transparency", "Sec-CH-UA", "Sec-CH-UA-Arch", "Sec-CH-UA-Bitness", "Sec-CH-UA-Full-Version", "Deprecated", "Sec-CH-UA-Full-Version-List", "Sec-CH-UA-Mobile", "Sec-CH-UA-Model", "Sec-CH-UA-Platform", "Sec-CH-UA-Platform-Version", "Sec-Fetch-Dest", "Sec-Fetch-Mode", "Sec-Fetch-Site", "Sec-Fetch-User", "Sec-GPC", "Sec-Purpose", "Sec-WebSocket-Accept", "Server", "Server-Timing", "Service-Worker-Navigation-Preload", "Set-Cookie", "SourceMap", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Tk", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "Viewport-Width", "Want-Digest", "Deprecated", "Warning", "Deprecated", "Width", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Proto", "X-Frame-Options", "X-XSS-Protection"];

/**
 * Represents HTTP headers with utility methods for manipulation.
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
        return HEADERS.find((key) => new RegExp(`^${name}$`, "i").test(key)) ?? name;
    }
    set(name, value) {
        name = this.key(name);
        this[name] = value;
    }
    values() {
        return Object.values(this);
    }
}

// // Usage example
// var headers=new Headers()
// headers.set('name','value')
// headers.set('content-type','application/json')
// console.log(headers.key('Content-Type'))
// console.log(headers.key('Content-type'))
// console.log(headers.key('content-Type'))
// console.log(headers.key('content-type'))
// console.log(headers)

/**
 * Represents a network request.
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

        this.agent =
            options.agent ??
            new this.client.Agent({
                keepAlive: true,
            });
        this.insecureHTTPParser = options.insecureHTTPParser ?? true;
        this.timeout = options.timeout ?? 1000 * 30;

        this.body = options.body ?? "";

        if (!(this.body instanceof Readable)) {
            const readable = new Readable();
            readable.push(this.body);
            readable.push(null);
            this.body = readable;
        }

        // this.bodyUsed = options.bodyUsed;
        // this.cache = options.cache;
        this.credentials = options.credentials ?? "include";
        // this.destination = options.destination;
        this.headers = new Headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            Connection: "Keep-Alive",
            ...options.headers,
        });
        // this.integrity = options.integrity;
        this.method = options.method ?? "GET";
        // this.mode = options.mode;
        this.redirect = options.redirect ?? "follow";
        this.follow = options.follow ?? 30;
        // this.referrer = options.referrer;
        // this.referrerPolicy = options.referrerPolicy;
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

// // Usage example
// var request = new Request("http://localhost");
// console.log(request);

/**
 * Represents a network response.
 */
class Response {
    constructor(body, options = {}) {
        this.body = body;
        // this.bodyUsed = options.bodyUsed;
        this.headers = new Headers(options.headers);

        const contentEncoding = this.headers.get("Content-Encoding");
        if (/\bgzip\b/.test(contentEncoding)) {
            this.body = this.body.pipe(zlib.createGunzip());
        } else if (/\bdeflate\b/.test(contentEncoding)) {
            this.body = this.body.pipe(zlib.createInflate());
        } else if (/\bbr\b/.test(contentEncoding)) {
            this.body = this.body.pipe(zlib.createBrotliDecompress());
        }

        // this.redirected = options.redirected;
        this.status = options.status ?? options.statusCode;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText ?? options.statusMessage;
        // this.type = options.type;
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
    // async formData() {
    //     const buffer=await this.buffer()
    // }
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
 * Represents a cookie store.
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

// // Usage example
// var cookieStore = new CookieStore()
// cookieStore.set('name','value')
// cookieStore.set('name2','value2')
// cookieStore.set({
//     name:'name3',
//     value:'value3',
// })
// cookieStore.cookie='sessionId=38afes7a8'
// cookieStore.cookie='id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT'
// cookieStore.cookie='id=a3fWa; Max-Age=2592000'
// cookieStore.cookie='qwerty=219ffwef9w0f; Domain=somecompany.co.uk'
// cookieStore.cookie='sessionId=e8bb43229de9; Domain=foo.example.com'
// cookieStore.cookie='__Secure-ID=123; Secure; Domain=example.com'
// cookieStore.cookie='__Host-ID=123; Secure; Path=/'
// cookieStore.cookie='__Secure-id=1'
// cookieStore.cookie='__Host-id=1; Secure'
// cookieStore.cookie='__Host-id=1; Secure; Path=/; Domain=example.com'
// cookieStore.cookie='__Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;'
// cookieStore.cookie=[
//     'sessionId=38afes7a8',
//     'id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
//     'id=a3fWa; Max-Age=2592000',
//     'qwerty=219ffwef9w0f; Domain=somecompany.co.uk',
//     'sessionId=e8bb43229de9; Domain=foo.example.com',
//     '__Secure-ID=123; Secure; Domain=example.com',
//     '__Host-ID=123; Secure; Path=/',
//     '__Secure-id=1',
//     '__Host-id=1; Secure',
//     '__Host-id=1; Secure; Path=/; Domain=example.com',
//     '__Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;',
// ]
// console.log(cookieStore.cookie)

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

// //Usage example
// const store=new Store('./data/name/default.json')
// // store.data='name'
// // store.address=[]
// // store.address.push({address:'line1'})
// console.log(store)


/**
 * Performs a fetch operation for a network resource.
 * @param {string} resource - URL for the resource.
 * @param {Object} [options={}] - Fetch options.
 * @returns {Promise<Response>} - A Promise that resolves to a Response object.
 */
function fetch(resource, options = {}) {
    return new Promise((resolve, reject) => {
        const request = new Request(resource, options);

        if (!options.store) {
            options.store = new Store(`./data/${request.hostname}/default.min.json`);
        }

        const cookie = options.store.cookieStore.cookie;
        if (cookie && request.credentials === "includes") {
            // Cookie
            request.headers.set("Cookie", cookie);
        }

        if (process.env.NODE_ENV === "development") {
            const Agent = request.protocol === "https:" ? HttpsProxyAgent : HttpProxyAgent;
            request.agent = new Agent("http://127.0.0.1:8888");
        }

        const req = request.client.request(request);
        req.on("error", reject);
        req.on("response", (res) => {
            let response = new Response(res, {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                headers: res.headers,
            });

            const setCookie = response.headers.getSetCookie();

            if (setCookie.length) {
                options.store.cookieStore.cookie = setCookie;
            }

            const location = response.headers.get("Location");
            if (location && request.redirect === "follow" && request.follow > 0) {
                --request.follow;
                const url = new URL(location, request.origin);
                response = fetch(url.toString(), {
                    follow: request.follow,
                    store: options.store,
                });
            }
            resolve(response);
        });
        request.body.pipe(req);
    });
}


module.exports = {
    default:fetch,
    Headers,
    Request,
    Response,
    CookieStore,
    Store,
};

// // Usage example
// fetch("http://google.com", {
//     // redirect:'manual',
//     headers: {
//         "accept-encoding": "br",
//     },
// })
//     // .then(res=>res.text())
//     // .then(console.log)
//     .catch(console.log);
