const HTTP_HEADERS = ["Accept", "Accept-CH", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Accept-Patch", "Accept-Post", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Attribution-Reporting-Eligible", "Attribution-Reporting-Register-Source", "Attribution-Reporting-Register-Trigger", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Digest", "Content-Disposition", "Content-DPR", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Critical-CH", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Digest", "DNT", "Downlink", "DPR", "Early-Data", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Last-Modified", "Link", "Location", "Max-Forwards", "NEL", "No-Vary-Search", "Observe-Browsing-Topics", "Origin", "Origin-Agent-Cluster", "Permissions-Policy", "Pragma", "Priority", "Proxy-Authenticate", "Proxy-Authorization", "Range", "Referer", "Referrer-Policy", "Refresh", "Report-To", "Reporting-Endpoints", "Repr-Digest", "Retry-After", "RTT", "Save-Data", "Sec-Browsing-Topics", "Sec-CH-Prefers-Color-Scheme", "Sec-CH-Prefers-Reduced-Motion", "Sec-CH-Prefers-Reduced-Transparency", "Sec-CH-UA", "Sec-CH-UA-Arch", "Sec-CH-UA-Bitness", "Sec-CH-UA-Full-Version", "Sec-CH-UA-Full-Version-List", "Sec-CH-UA-Mobile", "Sec-CH-UA-Model", "Sec-CH-UA-Platform", "Sec-CH-UA-Platform-Version", "Sec-Fetch-Dest", "Sec-Fetch-Mode", "Sec-Fetch-Site", "Sec-Fetch-User", "Sec-GPC", "Sec-Purpose", "Sec-WebSocket-Accept", "Sec-WebSocket-Extensions", "Sec-WebSocket-Key", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version", "Server", "Server-Timing", "Service-Worker-Navigation-Preload", "Set-Cookie", "Set-Login", "SourceMap", "Speculation-Rules", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Tk", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "Viewport-Width", "Want-Content-Digest", "Want-Digest", "Want-Repr-Digest", "Width", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Proto", "X-Frame-Options", "X-XSS-Protection"];

/**
 * Menormalkan nama header HTTP ke format standar.
 * @param {string} name - Nama header HTTP yang ingin dinormalkan.
 * @returns {string} - Nama header yang dinormalkan atau nama asli jika tidak ditemukan.
 */
function normalizeHeaders(name) {
    return HTTP_HEADERS.find((key) => key.toLowerCase() === name.toLowerCase()) || name;
}

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

Headers.normalizeHeaders = normalizeHeaders;

module.exports = Headers;
