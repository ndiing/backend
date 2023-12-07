const crypto = require("crypto");
const Crypto = require("./crypto");
const moment = require("moment");
const { delay } = require("./helper");

function hotp(options = {}) {
    let { key, counter = 0, algorithm = "sha1", digits = 6, encoding } = options;

    let keyBytes;
    if (encoding === "base32") keyBytes = Crypto.decode(key, { encoding });
    else keyBytes = Buffer.from(key);

    const counterBytes = Buffer.alloc(8);
    counterBytes.writeUInt32BE(counter, 4);

    const hash = Crypto.hmac(counterBytes, { algorithm, key: keyBytes, encoding: "hex" });

    const offset = parseInt(hash.charAt(hash.length - 1), 16);

    let result = parseInt(hash.substring(offset * 2, offset * 2 + 2 * 4), 16);
    result = result & 0x7fffffff;
    return String(result)
        .padStart(digits, "0")
        .slice(0 - digits);
}

function totp(options = {}) {
    let { key, T = moment().unix() / 1000, T0 = 0, X = 30, algorithm = "sha1", digits = 6, encoding } = options;
    const counter = Math.floor((T - T0) / X);
    return hotp({ key, counter, algorithm, digits, encoding });
}

// Usage example
// console.log(hotp({ key:'12345678901234567890' }));
// console.log(hotp({ key:'12345678901234567890',counter:9 }));

// sha1=20
// sha256=32
// sha512=64

// console.log(totp({ T: 59, key: "12345678901234567890" }));
// console.log(totp({ T: 59, key: "12345678901234567890123456789012", algorithm: "sha256" }));
// console.log(totp({ T: 59, key: "1234567890123456789012345678901234567890123456789012345678901234", algorithm: "sha512" }));

function otpauth(options = {}) {
    const bytes = {
        SHA1: Buffer.alloc(20),
        SHA256: Buffer.alloc(32),
        SHA512: Buffer.alloc(64),
    };

    let {
        type = "totp", //hotp/totp
        label = "label",
        secret,
        issuer = "issuer",
        algorithm = "SHA1", //SHA1,SHA256,SHA512
        digits = 6,
        counter = 0, // when hotp
        period = 30, // when totp
    } = {};
    const url = new URL(`otpauth://${type}/${label}`);
    if (!secret) {
        secret = crypto.randomBytes(64).toString("base64");
        secret = bytes[algorithm].fill(secret);
        secret = Crypto.encode(secret, { encoding: "base32" });
    }
    if (secret !== undefined) url.searchParams.set("secret", secret);
    if (issuer !== undefined) url.searchParams.set("issuer", issuer);
    if (algorithm !== undefined) url.searchParams.set("algorithm", algorithm);
    if (digits !== undefined) url.searchParams.set("digits", digits);
    if (type === "hotp" && counter !== undefined) url.searchParams.set("counter", counter);
    if (type === "totp" && period !== undefined) url.searchParams.set("period", period);
    const qr = new URL(`https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl=`);
    qr.searchParams.set("chl", url.toString());
    return {
        type,
        label,
        secret,
        issuer,
        algorithm,
        digits,
        counter,
        period,
        url: url.toString(),
        qr: qr.toString(),
    };
}

// Usage example
// console.log(otpauth())
// key=GE2WWU2ZIFHDMWSTIRLUEVDOOM4U6TZL
// console.log(totp({key:'GE2WWU2ZIFHDMWSTIRLUEVDOOM4U6TZL',encoding:'base32'}))


module.exports = {
    hotp,
    totp,
    otpauth,
};
