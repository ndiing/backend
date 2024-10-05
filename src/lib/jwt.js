const crypto = require("crypto");

const signer = {
    /**
     * Membuat tanda tangan HMAC dengan algoritma SHA-256.
     *
     * @param {string} secret - Kunci rahasia yang digunakan untuk membuat HMAC.
     * @param {string} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil HMAC dalam format base64url.
     */
    hs256: (secret, data) => {
        return crypto.createHmac("sha256", secret).update(data).digest("base64url");
    },

    /**
     * Membuat tanda tangan HMAC dengan algoritma SHA-384.
     *
     * @param {string} secret - Kunci rahasia yang digunakan untuk membuat HMAC.
     * @param {string} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil HMAC dalam format base64url.
     */
    hs384: (secret, data) => {
        return crypto.createHmac("sha384", secret).update(data).digest("base64url");
    },

    /**
     * Membuat tanda tangan HMAC dengan algoritma SHA-512.
     *
     * @param {string} secret - Kunci rahasia yang digunakan untuk membuat HMAC.
     * @param {string} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil HMAC dalam format base64url.
     */
    hs512: (secret, data) => {
        return crypto.createHmac("sha512", secret).update(data).digest("base64url");
    },

    /**
     * Membuat tanda tangan RSA dengan algoritma SHA-256.
     *
     * @param {string|Buffer|Object} secret - Kunci RSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan RSA dalam format base64url.
     */
    rs256: (secret, data) => {
        return crypto.sign("sha256", data, secret).toString("base64url");
    },

    /**
     * Membuat tanda tangan RSA dengan algoritma SHA-384.
     *
     * @param {string|Buffer|Object} secret - Kunci RSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan RSA dalam format base64url.
     */
    rs384: (secret, data) => {
        return crypto.sign("sha384", data, secret).toString("base64url");
    },

    /**
     * Membuat tanda tangan RSA dengan algoritma SHA-512.
     *
     * @param {string|Buffer|Object} secret - Kunci RSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan RSA dalam format base64url.
     */
    rs512: (secret, data) => {
        return crypto.sign("sha512", data, secret).toString("base64url");
    },

    /**
     * Membuat tanda tangan ECDSA dengan algoritma SHA-256.
     *
     * @param {string|Buffer|Object} secret - Kunci ECDSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan ECDSA dalam format base64url.
     */
    es256: (secret, data) => {
        return crypto.sign("sha256", data, { key: secret, dsaEncoding: "ieee-p1363" }).toString("base64url");
    },

    /**
     * Membuat tanda tangan ECDSA dengan algoritma SHA-384.
     *
     * @param {string|Buffer|Object} secret - Kunci ECDSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan ECDSA dalam format base64url.
     */
    es384: (secret, data) => {
        return crypto.sign("sha384", data, { key: secret, dsaEncoding: "ieee-p1363" }).toString("base64url");
    },

    /**
     * Membuat tanda tangan ECDSA dengan algoritma SHA-512.
     *
     * @param {string|Buffer|Object} secret - Kunci ECDSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan ECDSA dalam format base64url.
     */
    es512: (secret, data) => {
        return crypto.sign("sha512", data, { key: secret, dsaEncoding: "ieee-p1363" }).toString("base64url");
    },

    /**
     * Membuat tanda tangan RSA-PSS dengan algoritma SHA-256.
     *
     * @param {string|Buffer|Object} secret - Kunci RSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan RSA-PSS dalam format base64url.
     */
    ps256: (secret, data) => {
        return crypto.sign("sha256", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString("base64url");
    },

    /**
     * Membuat tanda tangan RSA-PSS dengan algoritma SHA-384.
     *
     * @param {string|Buffer|Object} secret - Kunci RSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan RSA-PSS dalam format base64url.
     */
    ps384: (secret, data) => {
        return crypto.sign("sha384", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString("base64url");
    },

    /**
     * Membuat tanda tangan RSA-PSS dengan algoritma SHA-512.
     *
     * @param {string|Buffer|Object} secret - Kunci RSA yang digunakan untuk membuat tanda tangan.
     * @param {string|Buffer} data - Data yang akan ditandatangani.
     * @returns {string} - Hasil tanda tangan RSA-PSS dalam format base64url.
     */
    ps512: (secret, data) => {
        return crypto.sign("sha512", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString("base64url");
    },
};

const verifier = {
    /**
     * Memverifikasi tanda tangan HMAC dengan algoritma SHA-256.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string} secret - Kunci rahasia yang digunakan untuk memverifikasi.
     * @param {string} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    hs256: (signature, secret, data) => {
        return signature === signer.hs256(secret, data);
    },

    /**
     * Memverifikasi tanda tangan HMAC dengan algoritma SHA-384.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string} secret - Kunci rahasia yang digunakan untuk memverifikasi.
     * @param {string} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    hs384: (signature, secret, data) => {
        return signature === signer.hs384(secret, data);
    },

    /**
     * Memverifikasi tanda tangan HMAC dengan algoritma SHA-512.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string} secret - Kunci rahasia yang digunakan untuk memverifikasi.
     * @param {string} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    hs512: (signature, secret, data) => {
        return signature === signer.hs512(secret, data);
    },

    /**
     * Memverifikasi tanda tangan RSA dengan algoritma SHA-256.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    rs256: (signature, secret, data) => {
        return crypto.verify("sha256", data, secret, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan RSA dengan algoritma SHA-384.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    rs384: (signature, secret, data) => {
        return crypto.verify("sha384", data, secret, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan RSA dengan algoritma SHA-512.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    rs512: (signature, secret, data) => {
        return crypto.verify("sha512", data, secret, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan ECDSA dengan algoritma SHA-256.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer|Object} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    es256: (signature, secret, data) => {
        return crypto.verify("sha256", data, { key: secret, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan ECDSA dengan algoritma SHA-384.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer|Object} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    es384: (signature, secret, data) => {
        return crypto.verify("sha384", data, { key: secret, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan ECDSA dengan algoritma SHA-512.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer|Object} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    es512: (signature, secret, data) => {
        return crypto.verify("sha512", data, { key: secret, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan RSA-PSS dengan algoritma SHA-256.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer|Object} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    ps256: (signature, secret, data) => {
        return crypto.verify("sha256", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan RSA-PSS dengan algoritma SHA-384.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer|Object} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    ps384: (signature, secret, data) => {
        return crypto.verify("sha384", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, "base64url"));
    },

    /**
     * Memverifikasi tanda tangan RSA-PSS dengan algoritma SHA-512.
     *
     * @param {string} signature - Tanda tangan yang akan diverifikasi.
     * @param {string|Buffer|Object} secret - Kunci publik yang digunakan untuk memverifikasi.
     * @param {string|Buffer} data - Data asli yang digunakan untuk membuat tanda tangan.
     * @returns {boolean} - Hasil verifikasi, true jika valid.
     */
    ps512: (signature, secret, data) => {
        return crypto.verify("sha512", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, "base64url"));
    },
};

/**
 * Mengenkode header dan payload menjadi token JWT.
 *
 * @param {Object} header - Header JWT yang berisi algoritma dan tipe.
 * @param {Object} payload - Data atau payload yang akan dienkode dalam JWT.
 * @param {string} secret - Kunci rahasia yang digunakan untuk menandatangani token.
 * @returns {string} - Token JWT yang telah dienkode.
 */
function encode(header, payload, secret) {
    const sign = signer[header.alg.toLowerCase()];

    header = JSON.stringify(header);
    header = Buffer.from(header).toString("base64url");

    payload = JSON.stringify(payload);
    payload = Buffer.from(payload).toString("base64url");

    const data = [header, payload].join(".");

    const signature = sign(secret, data);

    const token = [data, signature].join(".");
    return token;
}

/**
 * Mendekode token JWT dan memverifikasi tanda tangan.
 *
 * @param {string} token - Token JWT yang akan didekode.
 * @param {string} secret - Kunci rahasia yang digunakan untuk memverifikasi tanda tangan token.
 * @returns {Object|null} - Payload yang telah didekode jika tanda tangan valid, atau null jika tidak valid.
 */
function decode(token, secret) {
    let [header, payload, signature] = token.split(".");
    const data = [header, payload].join(".");

    header = Buffer.from(header, "base64url");
    header = JSON.parse(header);

    payload = Buffer.from(payload, "base64url");
    payload = JSON.parse(payload);

    const verify = verifier[header.alg.toLowerCase()];

    if (verify(signature, secret, data)) {
        return payload;
    }

    return null;
}

module.exports = {
    signer,
    verifier,
    encode,
    decode,
};
