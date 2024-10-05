const zlib = require("zlib");
const Headers = require("./headers.js");

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

module.exports = Response;
