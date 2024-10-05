const { Readable } = require("stream");
const zlib = require("zlib");
const { decode } = require("./jwt.js");

/**
 * Middleware untuk melakukan kompresi pada respon HTTP berdasarkan `Accept-Encoding` dari header request.
 *
 * Mendukung kompresi Brotli (`br`), Gzip (`gzip`), dan Deflate (`deflate`).
 * Secara otomatis memilih metode kompresi yang sesuai berdasarkan preferensi client yang ada di header `accept-encoding`.
 *
 * @returns {Function} - Middleware Express yang menangani kompresi respon.
 */
function compression() {
    return (req, res, next) => {
        try {
            res.send = (body) => {
                if (typeof body === "string") {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);

                    body = readable;
                }

                const acceptEncoding = req.headers["accept-encoding"] ?? "";

                if (/\bbr\b/.test(acceptEncoding)) {
                    res.setHeader("Content-Encoding", "br");
                    body = body.pipe(zlib.createBrotliCompress());
                } else if (/\bgzip\b/.test(acceptEncoding)) {
                    res.setHeader("Content-Encoding", "gzip");
                    body = body.pipe(zlib.createGzip());
                } else if (/\bdeflate\b/.test(acceptEncoding)) {
                    res.setHeader("Content-Encoding", "deflate");
                    body = body.pipe(zlib.createDeflate());
                }

                body.pipe(res);
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware untuk menangani parsing body request berdasarkan metode HTTP dan `Content-Type`.
 *
 * Middleware ini memproses body request untuk metode `POST`, `PATCH`, dan `PUT`.
 * Jika `Content-Type` adalah `application/json`, maka body akan diparsing sebagai JSON.
 * Jika `Content-Type` adalah `application/x-www-form-urlencoded`, maka body akan diparsing menjadi objek form data.
 *
 * @returns {Function} - Middleware Express yang memproses dan memparsing body request.
 */
function messages() {
    return async (req, res, next) => {
        try {
            const methods = ["POST", "PATCH", "PUT"];

            if (methods.includes(req.method)) {
                const chunks = [];
                for await (const chunk of req) {
                    chunks.push(chunk);
                }

                const buffer = Buffer.concat(chunks);

                const contentType = req.headers["content-type"] ?? "";

                if (contentType.includes("application/json")) {
                    req.body = JSON.parse(buffer);
                } else if (contentType.includes("application/x-www-form-urlencoded")) {
                    req.body = Object.fromEntries(new URLSearchParams(buffer.toString()).entries());
                }
            }

            next();
        } catch (error) {
            next();
        }
    };
}

/**
 * Middleware untuk menangani parsing cookie dari header request dan memungkinkan pengaturan cookie di response.
 *
 * - Pada request: Cookie yang terdapat di header `cookie` akan diparsing dan disimpan di `req.cookies` sebagai objek.
 * - Pada response: Cookie dapat disetel dengan fungsi `res.cookie`, yang menerima nama, nilai, dan atribut cookie.
 *
 * Atribut cookie yang didukung: `domain`, `expires`, `httpOnly`, `maxAge`, `partitioned`, `path`, `secure`, `sameSite`.
 *
 * @returns {Function} - Middleware Express untuk menangani cookie request dan response.
 */
function cookies() {
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

    return (req, res, next) => {
        try {
            req.cookies = {};

            const cookie = req.headers["cookie"] ?? "";

            if (cookie) {
                for (const [, name, value] of cookie.matchAll(/([^= ]+)=([^;]+)/g)) {
                    req.cookies[name] = value;
                }
            }

            const setCookie = [];
            res.cookie = (name, value, attributes = {}) => {
                const array = [];

                array.push([name, value].join("="));
                for (const name in attributes) {
                    const value = attributes[name];
                    const key = COOKIE_ATTRIBUTES[name];

                    if (!key) {
                        continue;
                    }

                    array.push([key, value].join("="));
                }

                setCookie.push(array.join("; "));

                res.setHeader("Set-Cookie", setCookie);
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware untuk menambahkan header keamanan pada respon HTTP.
 *
 * Header yang ditambahkan:
 * - `X-Content-Type-Options`: Menghindari penentuan jenis MIME oleh browser (nosniff).
 * - `X-Frame-Options`: Mencegah embedding dalam iframe (DENY).
 * - `Strict-Transport-Security`: Menerapkan HTTPS pada semua permintaan dengan `max-age` 2 tahun dan include subdomains (preload).
 * - `X-XSS-Protection`: Mengaktifkan perlindungan XSS di browser.
 * - `Content-Security-Policy`: Mengatur kebijakan sumber konten agar hanya dari domain sendiri (default-src 'self').
 * - `Referrer-Policy`: Mencegah pengiriman informasi referrer (no-referrer).
 *
 * @returns {Function} Middleware Express yang menambahkan header keamanan pada response.
 */
function security() {
    return (req, res, next) => {
        try {
            const headers = {
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
                "X-XSS-Protection": "1; mode=block",
                "Content-Security-Policy": "default-src 'self'",
                "Referrer-Policy": "no-referrer",
            };
            for (const name in headers) {
                const value = headers[name];
                res.setHeader(name, value);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware untuk menangani Cross-Origin Resource Sharing (CORS).
 *
 * Middleware ini menambahkan header yang memungkinkan permintaan lintas asal
 * (cross-origin) untuk diizinkan dari semua sumber. Header yang ditambahkan meliputi:
 * - `Access-Control-Allow-Origin`: Mengizinkan semua asal (`*`).
 * - `Access-Control-Allow-Methods`: Mengizinkan metode HTTP: GET, POST, PUT, DELETE, OPTIONS.
 * - `Access-Control-Allow-Headers`: Mengizinkan header yang digunakan: Content-Type, Authorization.
 * - `Access-Control-Allow-Credentials`: Mengizinkan pengiriman kredensial (true).
 *
 * @returns {Function} Middleware Express untuk mengizinkan permintaan CORS.
 */
function cors() {
    return (req, res, next) => {
        try {
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true",
            };
            for (const name in headers) {
                const value = headers[name];
                res.setHeader(name, value);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware untuk menangani otorisasi berdasarkan izin akses.
 *
 * Middleware ini memeriksa apakah pengguna memiliki izin untuk mengakses
 * endpoint tertentu berdasarkan alamat IP, metode HTTP, dan token otorisasi.
 *
 * Izin akses diatur dalam bentuk pola regex untuk alamat IP dan path.
 *
 * @returns {Function} Middleware Express untuk memeriksa otorisasi pengguna.
 */
function authorization() {
    const permissions = [
        {
            path: "^.*$",
            matcher: "^(127\\.0\\.0\\.1|10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|192\\.168\\.\\d{1,3}\\.\\d{1,3}|172\\.(1[6-9]|2[0-9]|3[0-1])\\.\\d{1,3}\\.\\d{1,3})$",
            POST: "any",
            GET: "any",
            PATCH: "any",
            DELETE: "any",
            PUT: "any",
        },
    ];

    function getPermission(pathname_, remoteAddress_, method) {
        return permissions.find((permission) => {
            return new RegExp(permission.path).test(pathname_) && new RegExp(permission.matcher).test(remoteAddress_) && permission[method];
        });
    }

    return (req, res, next) => {
        try {
            let permission = getPermission(req.pathname_, req.remoteAddress_, req.method);

            if (permission) {
                return next();
            }

            const [, token] = (req.headers["authorization"] ?? "").split(" ");

            if (!token) {
                res.statusCode = 401;
                return res.json({ message: http.STATUS_CODES[res.statusCode] });
            }

            const payload = decode(token, "your-256-bit-secret");
            if (!payload) {
                res.statusCode = 400;
                return res.json({ message: http.STATUS_CODES[res.statusCode] });
            }

            permission = getPermission(req.pathname_, payload.role, req.method);

            if (permission) {
                return next();
            }

            res.statusCode = 403;
            return res.json({ message: http.STATUS_CODES[res.statusCode] });
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Middleware untuk menangani permintaan yang tidak ditemukan (404).
 *
 * Middleware ini mengatur respons dengan status 404 dan mengembalikan
 * pesan "Tidak ditemukan" ketika rute yang diminta tidak ada.
 *
 * @returns {Function} Middleware Express untuk menangani permintaan yang tidak ditemukan.
 */
function fallback() {
    return (req, res, next) => {
        res.statusCode = 404;
        res.json({ message: "Tidak ditemukan" });
    };
}

/**
 * Middleware untuk menangani semua kesalahan yang tidak tertangani.
 *
 * Middleware ini mengubah status kode respons menjadi 500 jika status kode
 * saat ini berada dalam rentang 200 hingga 299. Kemudian, ia mengembalikan
 * pesan kesalahan dalam format JSON.
 *
 * @param {Error} err - Objek kesalahan yang dilemparkan.
 * @param {Object} req - Objek permintaan Express.
 * @param {Object} res - Objek respons Express.
 * @param {Function} next - Fungsi untuk melanjutkan ke middleware berikutnya.
 * @returns {void}
 */
function catchAll() {
    return (err, req, res, next) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            res.statusCode = 500;
        }

        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

        res.json({ message: err.message });
    };
}

module.exports = {
    compression,
    messages,
    cookies,
    security,
    cors,
    authorization,
    fallback,
    catchAll,
};
