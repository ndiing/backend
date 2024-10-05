const HTTP_HEADERS = ["Accept", "Accept-CH", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Accept-Patch", "Accept-Post", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Attribution-Reporting-Eligible", "Attribution-Reporting-Register-Source", "Attribution-Reporting-Register-Trigger", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Digest", "Content-Disposition", "Content-DPR", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Critical-CH", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Digest", "DNT", "Downlink", "DPR", "Early-Data", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Last-Modified", "Link", "Location", "Max-Forwards", "NEL", "No-Vary-Search", "Observe-Browsing-Topics", "Origin", "Origin-Agent-Cluster", "Permissions-Policy", "Pragma", "Priority", "Proxy-Authenticate", "Proxy-Authorization", "Range", "Referer", "Referrer-Policy", "Refresh", "Report-To", "Reporting-Endpoints", "Repr-Digest", "Retry-After", "RTT", "Save-Data", "Sec-Browsing-Topics", "Sec-CH-Prefers-Color-Scheme", "Sec-CH-Prefers-Reduced-Motion", "Sec-CH-Prefers-Reduced-Transparency", "Sec-CH-UA", "Sec-CH-UA-Arch", "Sec-CH-UA-Bitness", "Sec-CH-UA-Full-Version", "Sec-CH-UA-Full-Version-List", "Sec-CH-UA-Mobile", "Sec-CH-UA-Model", "Sec-CH-UA-Platform", "Sec-CH-UA-Platform-Version", "Sec-Fetch-Dest", "Sec-Fetch-Mode", "Sec-Fetch-Site", "Sec-Fetch-User", "Sec-GPC", "Sec-Purpose", "Sec-WebSocket-Accept", "Sec-WebSocket-Extensions", "Sec-WebSocket-Key", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version", "Server", "Server-Timing", "Service-Worker-Navigation-Preload", "Set-Cookie", "Set-Login", "SourceMap", "Speculation-Rules", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Tk", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "Viewport-Width", "Want-Content-Digest", "Want-Digest", "Want-Repr-Digest", "Width", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Proto", "X-Frame-Options", "X-XSS-Protection"];

const http = require("http");
const https = require("https");
const { Readable } = require("stream");
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");
const { read, write } = require("./helper.js");

/**
 * Menormalkan nama header HTTP ke format standar.
 * @param {string} name - Nama header HTTP yang ingin dinormalkan.
 * @returns {string} - Nama header yang dinormalkan atau nama asli jika tidak ditemukan.
 */
function normalizeHeaders(name) {
    return HTTP_HEADERS.find((key) => key.toLowerCase() === name.toLowerCase()) || name;
}

/**
 * Kelas ObjectObserver digunakan untuk mengamati perubahan pada objek JavaScript.
 */
class ObjectObserver {
    /**
     * Membuat instance ObjectObserver.
     * @param {Object} [target={}] - Objek yang ingin diamati.
     * @param {Function} [callback=() => {}] - Fungsi callback yang dipanggil saat terjadi perubahan.
     */
    constructor(target = {}, callback = () => {}) {
        this.target = target;
        this.callback = callback;

        return new Proxy(this.target, this);
    }

    /**
     * Metode ini dipanggil saat properti dari objek diakses.
     * @param {Object} target - Objek yang sedang diamati.
     * @param {string} property - Nama properti yang diakses.
     * @returns {any} - Nilai dari properti yang diakses.
     */
    get(target, property) {
        if (["[object Object]", "[object Array]"].includes(toString.call(target[property]))) {
            return new Proxy(target[property], this);
        }

        return target[property];
    }

    /**
     * Metode ini dipanggil saat properti diubah.
     * @param {Object} target - Objek yang sedang diamati.
     * @param {string} property - Nama properti yang diubah.
     * @param {any} value - Nilai baru untuk properti tersebut.
     * @returns {boolean} - Mengembalikan true jika operasi berhasil.
     */
    set(target, property, value) {
        const oldValue = target[property];
        if (oldValue === value) {
            return true;
        }

        Reflect.set(target, property, value);

        this.callback(this.target);

        return true;
    }

    /**
     * Metode ini dipanggil saat properti dihapus.
     * @param {Object} target - Objek yang sedang diamati.
     * @param {string} property - Nama properti yang dihapus.
     * @returns {boolean} - Mengembalikan true jika operasi berhasil.
     */
    deleteProperty(target, property) {
        const oldValue = target[property];
        if (oldValue === undefined) {
            return true;
        }

        Reflect.deleteProperty(target, property);

        this.callback(this.target);

        return true;
    }
}

// // test store
// // passed
// {
//     const store = new ObjectObserver({},console.log)
//     store.name='value'
//     store.object = {}
//     store.object.name='value'
//     console.log(store)
// }

/**
 * Mengnormalize cookie menjadi objek dengan properti 'name' dan 'value'.
 *
 * Jika parameter 'name' bukan objek, fungsi ini akan mengonversi
 * menjadi objek dengan properti 'name' dan 'value'.
 *
 * @param {string|Object} name - Nama cookie atau objek cookie.
 * @param {string} [value] - Nilai cookie (jika 'name' adalah string).
 * @returns {Object} - Objek cookie dengan properti 'name' dan 'value'.
 */
function normalizeCookie(name, value) {
    let object = name;
    if (typeof name !== "object") {
        object = { name, value };
    }

    return object;
}

const COOKIE_ATTRIBUTES_REGEXP = /^(Domain|Expires|HttpOnly|Max-Age|Partitioned|Path|Secure|SameSite)$/i;

/**
 * Kelas CookieStore untuk mengelola cookie.
 *
 * Kelas ini menyediakan metode untuk mengatur, mendapatkan, dan menghapus cookie
 * dari objek ini. Selain itu, cookie dapat diatur dan diambil dalam bentuk
 * string yang sesuai dengan format cookie HTTP.
 */
class CookieStore {
    /**
     * Mengambil semua cookie dalam format string.
     * @returns {string} - String yang berisi semua cookie yang dipisahkan oleh '; '.
     */
    get cookie() {
        const array = [];

        for (const [, { name, value }] of Object.entries(this)) {
            array.push([name, value].join("="));
        }

        return array.join("; ");
    }

    /**
     * Mengatur cookie dari string atau array string.
     * @param {string|string[]} value - String atau array string yang berisi cookie.
     */
    set cookie(value) {
        let array = value;
        if (!Array.isArray(array)) {
            array = [array];
        }

        for (const string of array) {
            for (const [, name, value] of string.matchAll(/([^= ]+)=([^;]+)/g)) {
                if (COOKIE_ATTRIBUTES_REGEXP.test(name)) {
                    continue; // skip attributes
                }

                if (value) {
                    this.set(name, value);
                } else {
                    this.delete(name);
                }
            }
        }
    }

    /**
     * Konstruktor untuk menginisialisasi CookieStore dengan cookie.
     * @param {Object} init - Objek yang berisi cookie yang ingin diatur.
     */
    constructor(init) {
        if (typeof init === "object") {
            for (const name in init) {
                const options = init[name];
                this.set(options);
            }
        }
    }

    /**
     * Menghapus cookie berdasarkan nama.
     * @param {string|Object} name - Nama cookie yang ingin dihapus.
     */
    delete(name) {
        let options = normalizeCookie(name);
        delete this[options.name];
    }

    /**
     * Mendapatkan nilai cookie berdasarkan nama.
     * @param {string|Object} name - Nama cookie yang ingin diambil.
     * @returns {string|undefined} - Nilai cookie atau undefined jika tidak ditemukan.
     */
    get(name) {
        let options = normalizeCookie(name);
        return this[options.name];
    }

    /**
     * Mendapatkan semua nilai cookie dengan nama yang sama.
     * @param {string|Object} name - Nama cookie yang ingin diambil.
     * @returns {Array} - Array yang berisi semua nilai cookie yang ditemukan.
     */
    getAll(name) {
        let options = normalizeCookie(name);
        return [].concat(this[options.name]).filter(Boolean);
    }

    /**
     * Mengatur cookie dengan nama dan nilai.
     * @param {string|Object} name - Nama cookie.
     * @param {string} value - Nilai cookie.
     */
    set(name, value) {
        let options = normalizeCookie(name, value);
        this[options.name] = options;
    }
}

// test CookieStore
// passed
// {
//     const cookieStore = new CookieStore()
//     cookieStore.set('name','value')
//     cookieStore.set('name2','value2')
//     cookieStore.set('name3','value3')
//     console.log(cookieStore)
// }

// // passed
// {
//     const cookieStore = new CookieStore()

//     const testdata = [
//         "sessionId=38afes7a8",
//         "id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT",
//         "id=a3fWa; Max-Age=2592000",
//         "qwerty=219ffwef9w0f; Domain=somecompany.co.uk",
//         "sessionId=e8bb43229de9; Domain=foo.example.com",
//         "__Secure-ID=123; Secure; Domain=example.com",
//         "__Host-ID=123; Secure; Path=/",
//         "__Secure-id=1",
//         "__Host-id=1; Secure",
//         "__Host-id=1; Secure; Path=/; Domain=example.com",
//         "__Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;",

//         ]

//     cookieStore.cookie=testdata[0] // with string
//     cookieStore.cookie=testdata // with array

//     console.log(cookieStore.cookie)
// }

/**
 * Membuat store yang terhubung dengan file JSON untuk menyimpan dan mengelola data.
 *
 * @param {string} filename - Nama file tempat data akan disimpan dan dibaca.
 * @returns {Proxy} - Sebuah proxy untuk mengamati dan mengelola objek store.
 */
function createStore(filename) {
    const target = read(filename, {});

    target.cookieStore = new CookieStore(target.cookieStore);

    const proxy = new ObjectObserver(target, (newTarget) => {
        write(filename, newTarget);
    });

    return proxy;
}

// test store

// // passed
// {
//     const store = createStore('./data/data.json')
//     // store.name='value'
//     console.log(store)
// }

/**
 * Kelas untuk mengelola header HTTP dengan metode untuk menambah, menghapus, dan mengambil nilai header.
 */
class Headers {
    /**
     * Membuat instance Headers dengan nilai awal.
     *
     * @param {object|Array} init - Objek atau array pasangan kunci-nilai untuk menginisialisasi header.
     */
    constructor(init) {
        if (typeof init === "object") {
            if (!Array.isArray(init)) {
                init = Object.entries(init);
            }

            for (const [name, value] of init) {
                this.append(name, value);
            }
        }
    }

    /**
     * Menambahkan nilai ke header dengan nama yang diberikan.
     *
     * @param {string} name - Nama header.
     * @param {string} value - Nilai yang akan ditambahkan ke header.
     */
    append(name, value) {
        name = normalizeHeaders(name);
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

    /**
     * Menghapus header dengan nama yang diberikan.
     *
     * @param {string} name - Nama header yang akan dihapus.
     */
    delete(name) {
        name = normalizeHeaders(name);
        delete this[name];
    }

    /**
     * Mengembalikan iterator untuk entri header (nama dan nilai).
     *
     * @returns {IterableIterator} - Iterator untuk entri header.
     */
    *entries() {
        for (const [name, value] of Object.entries(this)) {
            yield [name, value];
        }
    }

    /**
     * Menjalankan fungsi callback untuk setiap entri header.
     *
     * @param {function} callbackFn - Fungsi callback yang akan dijalankan untuk setiap entri.
     */
    forEach(callbackFn) {
        for (const [name, value] of Object.entries(this)) {
            callbackFn(value, name, this);
        }
    }

    /**
     * Mengambil nilai header dengan nama yang diberikan.
     *
     * @param {string} name - Nama header yang akan diambil nilainya.
     * @returns {string|null} - Nilai header, atau null jika header tidak ada.
     */
    get(name) {
        name = normalizeHeaders(name);
        if (Array.isArray(this[name])) {
            return this[name].join(", ");
        }

        return this[name] ?? null;
    }

    /**
     * Mengambil semua nilai header "Set-Cookie".
     *
     * @returns {string[]} - Array yang berisi nilai-nilai dari header "Set-Cookie".
     */
    getSetCookie() {
        let name = "Set-Cookie";
        name = normalizeHeaders(name);

        return [].concat(this[name]).filter(Boolean);
    }

    /**
     * Memeriksa apakah header dengan nama tertentu ada.
     *
     * @param {string} name - Nama header yang akan diperiksa.
     * @returns {boolean} - True jika header ada, sebaliknya false.
     */
    has(name) {
        name = normalizeHeaders(name);
        return !!this[name];
    }

    /**
     * Mengembalikan iterator untuk kunci header.
     *
     * @returns {IterableIterator} - Iterator untuk kunci header.
     */
    *keys() {
        for (const [name] of Object.entries(this)) {
            yield name;
        }
    }

    /**
     * Mengatur nilai untuk header dengan nama yang diberikan.
     *
     * @param {string} name - Nama header.
     * @param {string} value - Nilai yang akan diatur untuk header.
     */
    set(name, value) {
        name = normalizeHeaders(name);
        this[name] = value;
    }

    /**
     * Mengembalikan iterator untuk nilai header.
     *
     * @returns {IterableIterator} - Iterator untuk nilai header.
     */
    *values() {
        for (const [, value] of Object.entries(this)) {
            yield value;
        }
    }
}

// test headers

// // passed
// {
//     // Create a test Headers object
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "text/xml");
//     myHeaders.append("Vary", "Accept-Language");

//     // Display the keys
//     for (const key of myHeaders.keys()) {
//         console.log(key);
//     }

// }

// // passed
// {
//     const myHeaders = new Headers(); // Currently empty
//     myHeaders.append("Content-Type", "image/jpeg");
//     myHeaders.set("Content-Type", "text/html");
//     myHeaders.set("Accept-Encoding", "deflate");
//     myHeaders.set("Accept-Encoding", "gzip");
//     console.log(myHeaders.get("Accept-Encoding")); // Returns 'gzip'

// }

// // passed
// {
//     // Create a test Headers object
// const myHeaders = new Headers();
// myHeaders.append("Content-Type", "text/xml");
// myHeaders.append("Vary", "Accept-Language");

// // Display the values
// for (const value of myHeaders.values()) {
//   console.log(value);
// }

// }

// // passed
// {
//     const myHeaders = new Headers(); // Currently empty
//     myHeaders.append("Content-Type", "image/jpeg");
//     console.log(myHeaders.has("Content-Type")); // Returns true
//     console.log(myHeaders.has("Accept-Encoding")); // Returns false

// }

// passed
// {
//     const myHeaders = new Headers(); // Currently empty
//     myHeaders.append("Content-Type", "image/jpeg");
//     console.log(myHeaders.get("Content-Type")); // Returns 'image/jpeg'

// }

// passed
// {
//     const httpHeaders = {
//         "Content-Type": "image/jpeg",
//         "X-My-Custom-Header": "Zeke are cool",
//       };
//       const myHeaders = new Headers(httpHeaders);
//       console.log(myHeaders)
// }

// passed
// {
//     const headers = [
//         ["Set-Cookie", "greeting=hello"],
//         ["Set-Cookie", "name=world"],
//       ];
//       const myHeaders = new Headers(headers);
//       console.log(myHeaders)
// }

// // passed
// {
//     const myHeaders = new Headers(); // Currently empty
//     myHeaders.append("Content-Type", "image/jpeg");
//     console.log(myHeaders.get("Content-Type")); // Returns 'image/jpeg'

//     myHeaders.append("Accept-Encoding", "deflate");
//     myHeaders.append("Accept-Encoding", "gzip");
//     console.log(myHeaders.get("Accept-Encoding")); // Returns 'deflate, gzip'
// }

// // passed
// {
//     const myHeaders = new Headers(); // Currently empty
//     myHeaders.append("Content-Type", "image/jpeg");
//     console.log(myHeaders.get("Content-Type")); // Returns 'image/jpeg'
//     myHeaders.delete("Content-Type");
//     console.log(myHeaders.get("Content-Type")); // Returns null, as it has been deleted

// }

// // passed
// {
//     // Create a test Headers object
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "text/xml");
//     myHeaders.append("Vary", "Accept-Language");

//     // Display the key/value pairs
//     for (const pair of myHeaders.entries()) {
//         console.log(`${pair[0]}: ${pair[1]}`);
//     }

// }

// // passed
// {
//     // Create a new test Headers object
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     myHeaders.append("Cookie", "This is a demo cookie");
//     myHeaders.append("compression", "gzip");

//     // Display the key/value pairs
//     myHeaders.forEach((value, key) => {
//     console.log(`${key} ==> ${value}`);
//     });

// }

// // passed
// {
//     const myHeaders = new Headers(); // Currently empty
//     console.log(myHeaders.get("Not-Set")); // Returns null
//     myHeaders.append("Content-Type", "image/jpeg");
//     console.log(myHeaders.get("Content-Type")); // Returns "image/jpeg"
//     myHeaders.append("Accept-Encoding", "deflate");
//     myHeaders.append("Accept-Encoding", "gzip");
//     console.log(myHeaders.get("Accept-Encoding")); // Returns "deflate, gzip"
//     console.log(myHeaders
//     .get("Accept-Encoding")
//     .split(",")
//     .map((v) => v.trimStart())); // Returns [ "deflate", "gzip" ]

// }

// // passed
// {
//     const headers = new Headers({
//         "Set-Cookie": "name1=value1",
//       });

//       headers.append("Set-Cookie", "name2=value2");

//       console.log(headers.getSetCookie());
//       // Returns ["name1=value1", "name2=value2"]

// }

/**
 * Kelas yang merepresentasikan sebuah permintaan HTTP.
 */
class Request {
    /**
     * Membuat instance Request dengan input URL dan opsi yang diberikan.
     *
     * @param {string} input - URL permintaan.
     * @param {object} [options={}] - Opsi tambahan untuk permintaan.
     * @param {string|ReadableStream} [options.body=""] - Isi dari permintaan.
     * @param {string} [options.credentials="same-origin"] - Kredensial yang digunakan untuk permintaan.
     * @param {Headers} [options.headers={}] - Header yang akan ditambahkan ke permintaan.
     * @param {string} [options.method="GET"] - Metode HTTP yang digunakan (GET, POST, dll).
     * @param {string} [options.redirect="follow"] - Kebijakan pengalihan.
     * @param {number} [options.follow=30] - Jumlah maksimum pengalihan.
     * @param {Agent} [options.agent] - Agent untuk koneksi.
     * @param {boolean} [options.insecureHTTPParser=true] - Mengizinkan parser HTTP yang tidak aman.
     * @param {AbortSignal} [options.signal] - Sinyal untuk membatalkan permintaan.
     * @param {number} [options.timeout=30000] - Batas waktu untuk permintaan dalam milidetik.
     */
    constructor(input, options = {}) {
        this.input = new URL(input);

        this.body = options.body ?? "";

        if (typeof this.body === "string") {
            const readable = new Readable();
            readable.push(this.body);
            readable.push(null);

            this.body = readable;
        }

        // this.bodyUsed = options.bodyUsed
        // this.cache = options.cache

        this.credentials = options.credentials ?? "same-origin";

        // this.destination = options.destination

        this.headers = new Headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            Host: this.input.host,
            Accept: "*/*",
            "Accept-Language": "*",
            "Accept-Encoding": "*",
            Connection: "keep-alive",
            ...options.headers,
        });

        // this.integrity = options.integrity

        this.method = options.method ?? "GET";

        // this.mode = options.mode

        this.redirect = options.redirect ?? "follow";
        this.follow = options.follow ?? 30;

        // this.referrer = options.referrer
        // this.referrerPolicy = options.referrerPolicy
        this.url = this.input.toString();

        this.client = this.input.protocol === "https:" ? https : http;

        this.agent = options.agent;

        if (!this.agent) {
            const Agent = this.client.Agent;

            const agent = new Agent({
                keepAlive: true,
                rejectUnauthorized: false,
            });

            this.agent = agent;
        }

        this.host = this.input.host;
        this.hostname = this.input.hostname;
        this.insecureHTTPParser = options.insecureHTTPParser ?? true;
        this.path = this.input.pathname + this.input.search + this.input.hash;
        this.port = parseInt(this.input.port || (this.input.protocol === "https:" ? 443 : 80));
        this.protocol = this.input.protocol;
        this.signal = options.signal ?? new AbortController().signal;
        this.timeout = options.timeout ?? 30 * 1000;
        this.origin = this.input.origin;
    }
    // arrayBuffer() { }
    // blob() { }
    // bytes() { }
    // clone() { }
    // formData() { }
    // json() { }
    // text() { }
}

// // test request
// // passed
// {
//     const request = new Request('http://google.com')
//     console.log(request)
// }

/**
 * Kelas yang merepresentasikan sebuah respons HTTP.
 */
class Response {
    /**
     * Membuat instance Response dengan isi dan opsi yang diberikan.
     *
     * @param {ReadableStream|Buffer|string} body - Isi dari respons.
     * @param {object} [options={}] - Opsi tambahan untuk respons.
     * @param {Headers} [options.headers={}] - Header yang akan ditambahkan ke respons.
     * @param {number} [options.status=200] - Kode status HTTP.
     * @param {string} [options.statusText="OK"] - Pesan status HTTP.
     * @param {string} [options.url] - URL dari respons.
     */
    constructor(body, options = {}) {
        this.body = body;

        // this.bodyUsed = options.bodyUsed

        this.headers = new Headers(options.headers);

        this.ok = options.status >= 200 && options.status < 300;

        // this.redirected = options.redirected

        this.status = options.status;
        this.statusText = options.statusText;

        // this.type = options.type

        this.url = options.url;
    }
    // static error(){}
    // static json(){}
    // static redirect(){}

    /**
     * Mengambil isi respons sebagai Buffer.
     *
     * @returns {Promise<Buffer>} Buffer dari isi respons.
     */
    async buffer() {
        if (this.headers.has("Content-Encoding")) {
            const contentEncoding = this.headers.get("Content-Encoding");
            if (/\bbr\b/.test(contentEncoding)) {
                this.body = this.body.pipe(zlib.createBrotliDecompress());
            } else if (/\bgzip\b/.test(contentEncoding)) {
                this.body = this.body.pipe(zlib.createGunzip());
            } else if (/\bdeflate\b/.test(contentEncoding)) {
                this.body = this.body.pipe(zlib.createInflate());
            }
        }

        const chunks = [];
        for await (const chunk of this.body) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        return buffer;
    }
    // async arrayBuffer(){}
    // async blob(){}
    // async bytes(){}
    // async clone(){}
    // async formData(){}

    /**
     * Mengambil isi respons sebagai objek JSON.
     *
     * @returns {Promise<object>} Objek JSON yang diambil dari isi respons.
     */
    async json() {
        const buffer = await this.buffer();
        return JSON.parse(buffer);
    }

    /**
     * Mengambil isi respons sebagai string.
     *
     * @returns {Promise<string>} String dari isi respons.
     */
    async text() {
        const buffer = await this.buffer();
        return buffer.toString();
    }
}

/**
 * Melakukan permintaan HTTP dan mengembalikan respons.
 *
 * @param {string|URL} resource - URL atau sumber daya yang akan diambil.
 * @param {object} [options={}] - Opsi tambahan untuk permintaan.
 * @param {string} [options.credentials="same-origin"] - Menentukan apakah kredensial (seperti cookies) harus disertakan.
 * @param {object} [options.store] - Objek penyimpanan yang dapat digunakan untuk menyimpan cookies.
 * @param {string} [options.method="GET"] - Metode HTTP yang akan digunakan (GET, POST, dll.).
 * @param {number} [options.follow=30] - Jumlah maksimum pengalihan yang diizinkan.
 * @returns {Promise<Response>} - Promise yang mengembalikan objek Response.
 */
function fetch(resource, options = {}) {
    return new Promise(async (resolve, reject) => {
        const request = new Request(resource, options);

        if (options.credentials !== "omit" && options.store) {
            const cookie = options.store?.cookieStore?.cookie;
            if (cookie) {
                request.headers.set("Cookie", cookie);
            }
        }

        // process.env.HTTP_PROXY
        // const process.env.HTTP_PROXY = null; //'http://127.0.0.1:8888'
        if (config.httpProxy) {
            const request2 = new Request(config.httpProxy, {
                method: "CONNECT",
            });
            request2.path = [request.hostname, request.port].join(":");

            // overwrite host
            request.hostname = request2.hostname;
            request.port = request2.port;

            if (request.protocol === "https:") {
                const agent = await new Promise((resolve, reject) => {
                    const req2 = request2.client.request(request2);

                    req2.on("error", reject);
                    req2.on("timeout", () => req2.end());
                    req2.on("connect", (req, socket, head) => {
                        const Agent = request.client.Agent;
                        const agent = new Agent({
                            rejectUnauthorized: false,
                            keepAlive: true,
                            socket,
                        });
                        resolve(agent);
                    });

                    request2.body.pipe(req2);
                });
                // replace
                request.agent = agent;
            }
        }

        const req = request.client.request(request);

        req.on("error", reject);
        req.on("timeout", () => req.end());
        req.on("response", (res) => {
            let response = new Response(res, {
                headers: res.headers,
                status: res.statusCode,
                statusText: res.statusMessage,
                url: request.url,
            });

            // // Set-Cookie
            const setCookie = response.headers.getSetCookie();
            if (options.credentials !== "omit" && options.store?.cookieStore && setCookie.length) {
                options.store.cookieStore.cookie = setCookie;
            }

            // Location
            if (response.headers.has("Location") && request.redirect === "follow" && request.follow > 0) {
                --request.follow;
                const location = response.headers.get("Location");
                resource = new URL(location, request.origin);
                response = fetch(resource, {
                    follow: request.follow,
                    store: options.store,
                });
            }

            resolve(response);
        });

        request.body.pipe(req);
    });
}

fetch.ObjectObserver = ObjectObserver;
fetch.CookieStore = CookieStore;
fetch.Headers = Headers;
fetch.Request = Request;
fetch.Response = Response;

fetch.normalizeHeaders = normalizeHeaders;
fetch.normalizeCookie = normalizeCookie;
fetch.createStore = createStore;

module.exports = fetch;

// test fetch

// // passed
// {
//     const store = createStore('./data/data.json')

//     fetch('http://google.com',{
//         store
//     })
//     .then(console.log)
//     .catch(console.log)
// }

// // test compression
// // passed
// {
//     fetch('https://jsonplaceholder.typicode.com/posts/1',{
//         headers:{
//             'Accept-Encoding':'br'
//         }
//     })
//     .then(res=>res.text())
//     .then(console.log)
//     .catch(console.log)

//     fetch('https://jsonplaceholder.typicode.com/posts/1',{
//         headers:{
//             'Accept-Encoding':'gzip'
//         }
//     })
//     .then(res=>res.text())
//     .then(console.log)
//     .catch(console.log)

//     fetch('https://jsonplaceholder.typicode.com/posts/1',{
//         headers:{
//             'Accept-Encoding':'deflate'
//         }
//     })
//     .then(res=>res.text())
//     .then(console.log)
//     .catch(console.log)
// }

// passed
// {
//     // fetch('https://jsonplaceholder.typicode.com/posts/1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts', { method: 'POST', body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'PUT', body: JSON.stringify({ id: 1, title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'PATCH', body: JSON.stringify({ title: 'foo', }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'DELETE', }).then((response) => response.json()) .then((json) => console.log(json));;
//     // fetch('https://jsonplaceholder.typicode.com/posts?userId=1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1/comments') .then((response) => response.json()) .then((json) => console.log(json));
// }
