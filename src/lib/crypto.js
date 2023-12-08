const crypto = require("crypto");

const RFC4648 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const RFC4648_HEX = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Convert the given data to a DataView.
 * @param {ArrayBuffer|Buffer|Int8Array|Uint8Array|Uint8ClampedArray} data - Input data.
 * @returns {DataView} - The resulting DataView.
 * @throws {TypeError} - Throws if the input is not a supported data type.
 */
function toDataView(data) {
    if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
        return new DataView(data.buffer, data.byteOffset, data.byteLength);
    }

    if (data instanceof ArrayBuffer) {
        return new DataView(data);
    }

    throw new TypeError("Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray");
}

/**
 * Encode data to base32 format.
 * @param {Buffer|ArrayBuffer} data - Data to be encoded.
 * @param {string} [variant="RFC4648"] - Base32 encoding variant (RFC4648, RFC4648-HEX, Crockford).
 * @param {Object} [options={}] - Additional options (e.g., padding).
 * @returns {string} - Encoded data in base32 format.
 */
function base32Encode(data, letiant = "RFC4648", options) {
    options = options || {};
    let alphabet, defaultPadding;

    switch (letiant) {
        case "RFC3548":
        case "RFC4648":
            alphabet = RFC4648;
            defaultPadding = true;
            break;
        case "RFC4648-HEX":
            alphabet = RFC4648_HEX;
            defaultPadding = true;
            break;
        case "Crockford":
            alphabet = CROCKFORD;
            defaultPadding = false;
            break;
        default:
            throw new Error("Unknown base32 letiant: " + letiant);
    }

    const padding = options.padding !== undefined ? options.padding : defaultPadding;
    const view = toDataView(Buffer.from(data));
    // const view = toDataView(data);

    let bits = 0;
    let value = 0;
    let output = "";

    for (let i = 0; i < view.byteLength; i++) {
        value = (value << 8) | view.getUint8(i);
        bits += 8;

        while (bits >= 5) {
            output += alphabet[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }

    if (bits > 0) {
        output += alphabet[(value << (5 - bits)) & 31];
    }

    if (padding) {
        while (output.length % 8 !== 0) {
            output += "=";
        }
    }

    // return output;
    return output.replace(/\=+$/, "");
}

function readChar(alphabet, char) {
    let idx = alphabet.indexOf(char);

    if (idx === -1) {
        throw new Error("Invalid character found: " + char);
    }

    return idx;
}

/**
 * Decode base32 encoded input.
 * @param {string} input - Base32 encoded input.
 * @param {string} [variant="RFC4648"] - Base32 decoding variant (RFC4648, RFC4648-HEX, Crockford).
 * @returns {string} - Decoded data.
 */
function base32Decode(input, letiant = "RFC4648") {
    let alphabet;

    switch (letiant) {
        case "RFC3548":
        case "RFC4648":
            alphabet = RFC4648;
            input = input.replace(/=+$/, "");
            break;
        case "RFC4648-HEX":
            alphabet = RFC4648_HEX;
            input = input.replace(/=+$/, "");
            break;
        case "Crockford":
            alphabet = CROCKFORD;
            input = input.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1");
            break;
        default:
            throw new Error("Unknown base32 letiant: " + letiant);
    }

    let length = input.length;

    let bits = 0;
    let value = 0;

    let index = 0;
    let output = new Uint8Array(((length * 5) / 8) | 0);

    for (let i = 0; i < length; i++) {
        value = (value << 5) | readChar(alphabet, input[i]);
        bits += 5;

        if (bits >= 8) {
            output[index++] = (value >>> (bits - 8)) & 255;
            bits -= 8;
        }
    }

    // return output.buffer;
    return Buffer.from(output.buffer).toString();
}

// // Usage example
// let data = "string";
// data = base32Encode(data);
// console.log(data);
// data = base32Decode(data);
// console.log(data);

/**
 * Encodes data into a specific encoding format.
 * @param {string | Buffer | Uint8Array} data - The data to be encoded.
 * @param {Object} [options={}] - Encoding options.
 * @returns {string} - Encoded data.
 */
function encode(data, options = {}) {
    const { encoding = "base64" } = options;
    if (encoding === "base32") return base32Encode(data);
    return Buffer.from(data).toString(encoding);
}

/**
 * Decodes data from a specific encoding format.
 * @param {string} data - The data to be decoded.
 * @param {Object} [options={}] - Decoding options.
 * @returns {string} - Decoded data.
 */
function decode(data, options = {}) {
    const { encoding = "base64" } = options;
    if (encoding === "base32") return base32Decode(data);
    return Buffer.from(data, encoding).toString();
}

// // Usage example
// let data='string'
// data=encode(data,{encoding:'base32'})
// console.log(data)
// data=decode(data,{encoding:'base32'})
// console.log(data)

/**
 * Encrypts data using a specified algorithm.
 * @param {string} data - The data to be encrypted.
 * @param {Object} [options={}] - Encryption options.
 * @returns {string} - Encrypted data.
 */
function encrypt(data, options = {}) {
    const { algorithm = "aes-128-cbc", key = Buffer.alloc(16), iv = Buffer.alloc(16), encoding = "hex" } = options;
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString(encoding);
}

/**
 * Decrypts data using a specified algorithm.
 * @param {string} data - The data to be decrypted.
 * @param {Object} [options={}] - Decryption options.
 * @returns {string} - Decrypted data.
 */
function decrypt(data, options = {}) {
    const { algorithm = "aes-128-cbc", key = Buffer.alloc(16), iv = Buffer.alloc(16), encoding = "hex" } = options;
    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(data, encoding), cipher.final()]).toString();
}

// // Usage example
// let data='string'
// data=encrypt(data)
// console.log(data)
// data=decrypt(data)
// console.log(data)

/**
 * Encrypts data using a private key.
 * @param {string} data - The data to be encrypted.
 * @param {Object} [options={}] - Encryption options.
 * @returns {string} - Encrypted data.
 */
function privateEncrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.privateEncrypt(key, Buffer.from(data)).toString(encoding);
}

/**
 * Decrypts data using a public key.
 * @param {string} data - The data to be decrypted.
 * @param {Object} [options={}] - Decryption options.
 * @returns {string} - Decrypted data.
 */
function publicDecrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.publicDecrypt(key, Buffer.from(data, encoding)).toString();
}

/**
 * Encrypts data using a public key.
 * @param {string} data - The data to be encrypted.
 * @param {Object} [options={}] - Encryption options.
 * @returns {string} - Encrypted data.
 */
function publicEncrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.publicEncrypt(key, Buffer.from(data)).toString(encoding);
}

/**
 * Decrypts data using a private key.
 * @param {string} data - The data to be decrypted.
 * @param {Object} [options={}] - Decryption options.
 * @returns {string} - Decrypted data.
 */
function privateDecrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.privateDecrypt(key, Buffer.from(data, encoding)).toString();
}

// // Usage example
// let {publicKey,privateKey} = crypto.generateKeyPairSync("rsa", {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: "spki",
//         format: "pem",
//     },
//     privateKeyEncoding: {
//         type: "pkcs8",
//         format: "pem",
//     },
// });
// // publicKey,privateKey
// let data='string'
// data=privateEncrypt(data,{key:privateKey})
// console.log(data)
// data=publicDecrypt(data,{key:publicKey})
// console.log(data)
// data=publicEncrypt(data,{key:publicKey})
// console.log(data)
// data=privateDecrypt(data,{key:privateKey})
// console.log(data)

/**
 * Creates a digital signature using specified algorithm and private key.
 * @param {string} data - Data to sign.
 * @param {Object} [options={}] - Signing options.
 * @returns {string} - Digital signature.
 */
function sign(data, options = {}) {
    const { algorithm = "sha256", key, encoding = "hex" } = options;
    const sign = crypto.createSign(algorithm);
    sign.write(data);
    sign.end();
    return sign.sign(key, encoding);
}

/**
 * Verifies a digital signature using specified algorithm, public key, and signature.
 * @param {string} data - Data to verify.
 * @param {string} signature - Digital signature.
 * @param {Object} [options={}] - Verification options.
 * @returns {boolean} - True if the signature is verified, otherwise false.
 */
function verify(data, signature, options = {}) {
    const { algorithm = "sha256", key, encoding = "hex" } = options;
    const verify = crypto.createVerify(algorithm);
    verify.write(data);
    verify.end();
    return verify.verify(key, signature, encoding);
}

// // Usage example
// let {publicKey,privateKey} = crypto.generateKeyPairSync("rsa", {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: "spki",
//         format: "pem",
//     },
//     privateKeyEncoding: {
//         type: "pkcs8",
//         format: "pem",
//     },
// });
// let data='string'
// let signature=sign(data,{key:privateKey})
// console.log(signature)
// let verified=verify(data,signature,{key:privateKey})
// console.log(verified)

/**
 * Generates a cryptographic hash of the data using specified algorithm.
 * @param {string} data - Data to hash.
 * @param {Object} [options={}] - Hashing options.
 * @returns {string} - Hash value.
 */
function hash(data, options = {}) {
    const { algorithm = "sha256", encoding = "hex" } = options;
    return crypto.createHash(algorithm).update(data).digest(encoding);
}

/**
 * Computes an HMAC (Hash-based Message Authentication Code) using specified algorithm and key.
 * @param {string} data - Data to hash.
 * @param {Object} [options={}] - HMAC options.
 * @returns {string} - HMAC value.
 */
function hmac(data, options = {}) {
    const { algorithm = "sha256", key = "", encoding = "hex" } = options;
    return crypto.createHmac(algorithm, key).update(data).digest(encoding);
}

module.exports = {
    // toDataView,
    // base32Encode,
    // readChar,
    // base32Decode,
    encode,
    decode,
    encrypt,
    decrypt,
    privateEncrypt,
    publicDecrypt,
    publicEncrypt,
    privateDecrypt,
    sign,
    verify,
    hash,
    hmac,
};
