const crypto = require("crypto");
const Crypto = require("./crypto");
const moment = require("moment");
const { delay } = require("./helper");

/**
 * Generates a HMAC-based One-Time Password (HOTP).
 * @param {Object} options - Options for generating HOTP.
 * @param {string} options.secret - The secret secret used to generate the OTP.
 * @param {number} [options.counter=0] - The counter value for the OTP (default is 0).
 * @param {string} [options.algorithm="sha1"] - The hashing algorithm used (e.g., "sha1", "sha256", "sha512").
 * @param {number} [options.digits=6] - The number of digits in the generated OTP (default is 6).
 * @param {string} [options.encoding] - The encoding of the secret secret, if different from Buffer (e.g., "base32").
 * @returns {string} - The generated One-Time Password.
 */
function hotp(options = {}) {
    let { secret, counter = 0, algorithm = "sha1", digits = 6, encoding } = options;
    let keyBytes;

    if (encoding === "base32") {
        keyBytes = Crypto.decode(secret, { encoding });
    } else {
        keyBytes = Buffer.from(secret);
    }

    const counterBytes = Buffer.alloc(8);
    counterBytes.writeUInt32BE(counter, 4);

    const hash = Crypto.hmac(counterBytes, {
        algorithm,
        key: keyBytes,
        encoding: "hex",
    });

    const offset = parseInt(hash.charAt(hash.length - 1), 16);

    let result = parseInt(hash.substring(offset * 2, offset * 2 + 2 * 4), 16);
    result = result & 0x7fffffff;

    return String(result)
        .padStart(digits, "0")
        .slice(0 - digits);
}

/**
 * Generates a Time-based One-Time Password (TOTP).
 * @param {Object} options - Options for generating TOTP.
 * @param {string} options.secret - The secret secret used to generate the OTP.
 * @param {number} [options.T] - The time value for which OTP is generated (default is current time in seconds).
 * @param {number} [options.T0=0] - The initial time value (default is 0).
 * @param {number} [options.period=30] - The time step in seconds (default is 30).
 * @param {string} [options.algorithm="sha1"] - The hashing algorithm used (e.g., "sha1", "sha256", "sha512").
 * @param {number} [options.digits=6] - The number of digits in the generated OTP (default is 6).
 * @param {string} [options.encoding] - The encoding of the secret secret, if different from Buffer (e.g., "base32").
 * @returns {string} - The generated One-Time Password.
 */
function totp(options = {}) {
    let { secret, T = moment().unix(), T0 = 0, period = 30, algorithm = "sha1", digits = 6, encoding } = options;

    const counter = Math.floor((T - T0) / period);

    return hotp({ secret, counter, algorithm, digits, encoding });
}

/**
 * Generates a URL and QR code for OTP configuration (TOTP or HOTP) compatible with OTP authentication apps.
 * @param {Object} options - Options for generating OTP configuration.
 * @param {string} [options.type="totp"] - The type of OTP ("totp" or "hotp").
 * @param {string} [options.label="label"] - The label for the OTP entry.
 * @param {string} [options.secret] - The secret secret used for OTP generation.
 * @param {string} [options.issuer="issuer"] - The issuer name for the OTP entry.
 * @param {string} [options.algorithm="SHA1"] - The hashing algorithm used (e.g., "SHA1", "SHA256", "SHA512").
 * @param {number} [options.digits=6] - The number of digits in the generated OTP (default is 6).
 * @param {number} [options.counter=0] - The counter value for HOTP (applicable only if type is "hotp").
 * @param {number} [options.period=30] - The time step in seconds for TOTP (applicable only if type is "totp").
 * @returns {Object} - Information for OTP configuration including URL and QR code.
 */
function otpauth(options = {}) {
    const bytes = {
        SHA1: Buffer.alloc(20),
        SHA256: Buffer.alloc(32),
        SHA512: Buffer.alloc(64),
    };

    let { type = "totp", label = "label", secret, issuer = "issuer", algorithm = "SHA1", digits = 6, counter = 0, period = 30, encoding = "base32" } = options;

    const url = new URL(`otpauth://${type}/${label}`);

    if (!secret) {
        secret = crypto.randomBytes(64).toString("base64");
        secret = bytes[algorithm].fill(secret);
        secret = Crypto.encode(secret, { encoding });
    }

    if (secret !== undefined) {
        url.searchParams.set("secret", secret);
    }
    if (issuer !== undefined) {
        url.searchParams.set("issuer", issuer);
    }
    if (algorithm !== undefined) {
        url.searchParams.set("algorithm", algorithm);
    }
    if (digits !== undefined) {
        url.searchParams.set("digits", digits);
    }
    if (type === "hotp" && counter !== undefined) {
        url.searchParams.set("counter", counter);
    }
    if (type === "totp" && period !== undefined) {
        url.searchParams.set("period", period);
    }

    const qr = new URL(`https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl=`);
    qr.searchParams.set("chl", url.toString());

    return {
        type,
        label,
        secret,
        issuer,
        algorithm,
        digits,
        ...(type === "hotp" && { counter }),
        ...(type === "totp" && { period }),
        url: url.toString(),
        qr: qr.toString(),
        encoding,
    };
}

module.exports = {
    hotp,
    totp,
    otpauth,
};

// // Usage example
// console.log(hotp({ secret: "GRSGW6SXNJATARLTGRRFANTFPJDW4Q3J" }));
// console.log(totp({ secret: "GRSGW6SXNJATARLTGRRFANTFPJDW4Q3J" }));
// console.log(totp({ secret: "GRSGW6SXNJATARLTGRRFANTFPJDW4Q3J",encoding:'base32' }));
// // console.log(otpauth({}));
