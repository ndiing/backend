const crypto = require("crypto");

/**
 * Menghitung nilai HOTP (HMAC-based One-Time Password).
 * @param {Object} options - Opsi untuk menghasilkan HOTP.
 * @param {string} options.secret - Kunci rahasia untuk menghasilkan HOTP.
 * @param {number} options.count - Nilai hitungan untuk HOTP (biasanya waktu atau hitungan penggunaan).
 * @param {string} [options.algorithm='sha1'] - Algoritma HMAC yang digunakan (default: 'sha1').
 * @param {number} [options.digits=6] - Jumlah digit untuk hasil HOTP (default: 6).
 * @returns {string} - Nilai HOTP yang dihasilkan.
 */
function hotp(options = {}) {
    const { secret, count, algorithm = "sha1", digits = 6 } = options;
    const key = Buffer.from(secret);

    const data = Buffer.alloc(8);
    data.writeUInt32BE(count, 4);

    const hash = crypto.createHmac(algorithm, key).update(data).digest("hex");

    const offset = parseInt(hash.charAt(hash.length - 1), 16);

    const result = parseInt(hash.substring(offset * 2, offset * 2 + 2 * 4), 16) & 0x7fffffff;

    return String(result)
        .padStart(digits, "0")
        .slice(0 - digits);
}

/**
 * Menghitung nilai TOTP (Time-based One-Time Password).
 * @param {Object} options - Opsi untuk menghasilkan TOTP.
 * @param {string} options.secret - Kunci rahasia untuk menghasilkan TOTP.
 * @param {number} [options.T=Date.now()/1000] - Waktu saat ini dalam detik (default: waktu sekarang).
 * @param {number} [options.T0=0] - Waktu awal dalam detik (default: 0).
 * @param {number} [options.X=30] - Interval waktu dalam detik (default: 30).
 * @param {string} [options.algorithm='sha1'] - Algoritma HMAC yang digunakan (default: 'sha1').
 * @param {number} [options.digits=6] - Jumlah digit untuk hasil TOTP (default: 6).
 * @returns {string} - Nilai TOTP yang dihasilkan.
 */
function totp(options = {}) {
    const { secret, T = Math.floor(Date.now() / 1000), T0 = 0, X = 30, algorithm = "sha1", digits = 6 } = options;
    const count = Math.floor((T - T0) / X);

    return hotp({ secret, count, algorithm, digits });
}

module.exports = {
    hotp,
    totp,
};
