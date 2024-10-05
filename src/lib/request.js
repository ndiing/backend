const http = require("http");
const https = require("https");
const { Readable } = require("stream");
const Headers = require("./headers.js");

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

module.exports = Request;
