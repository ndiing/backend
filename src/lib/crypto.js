const crypto = require("crypto");

const RFC4648 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const RFC4648_HEX = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Converts data to a DataView.
 *
 * @param {(ArrayBuffer|Buffer|Int8Array|Uint8Array|Uint8ClampedArray)} data - The input data to convert.
 * @returns {DataView} A DataView object representing the input data.
 * @throws {TypeError} Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array, or Uint8ClampedArray.
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
 * Encodes data using base32 encoding.
 *
 * @param {(Buffer|string)} data - The data to encode.
 * @param {string} [letiant="RFC4648"] - The base32 variant to use for encoding (RFC3548, RFC4648, RFC4648-HEX, or Crockford).
 * @param {Object} [options] - Additional options for encoding.
 * @param {boolean} [options.padding] - Flag indicating whether to use padding in the output.
 * @returns {string} The base32 encoded string.
 * @throws {Error} Unknown base32 variant or invalid character found.
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
    return output.replace(/\=+$/, "");
}

/**
 * Reads a character from the provided alphabet.
 *
 * @param {string} alphabet - The alphabet to use.
 * @param {string} char - The character to read.
 * @returns {number} The index of the character in the alphabet.
 * @throws {Error} Invalid character found.
 */
function readChar(alphabet, char) {
    let idx = alphabet.indexOf(char);
    if (idx === -1) {
        throw new Error("Invalid character found: " + char);
    }
    return idx;
}

/**
 * Decodes data from base32 encoding.
 *
 * @param {string} input - The base32 encoded input string.
 * @param {string} [letiant="RFC4648"] - The base32 variant used for encoding (RFC3548, RFC4648, RFC4648-HEX, or Crockford).
 * @returns {string} The decoded data.
 * @throws {Error} Unknown base32 variant or invalid character found.
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
    return Buffer.from(output.buffer).toString();
}

/**
 * Encodes data using either base32 or another specified encoding.
 *
 * @param {(Buffer|string)} data - The data to encode.
 * @param {Object} [options={}] - Additional options for encoding.
 * @param {string} [options.encoding="base64"] - The encoding type to use (base64 or base32).
 * @returns {string} The encoded data string.
 */
function encode(data, options = {}) {
    const { encoding = "base64" } = options;
    if (encoding === "base32") return base32Encode(data);
    return Buffer.from(data).toString(encoding);
}

/**
 * Decodes data from either base32 or another specified encoding.
 *
 * @param {string} data - The data to decode.
 * @param {Object} [options={}] - Additional options for decoding.
 * @param {string} [options.encoding="base64"] - The encoding type to use (base64 or base32).
 * @returns {string} The decoded data string.
 */
function decode(data, options = {}) {
    const { encoding = "base64" } = options;
    if (encoding === "base32") return base32Decode(data);
    return Buffer.from(data, encoding).toString();
}

/**
 * Encrypts data using the specified algorithm, key, IV, and encoding.
 *
 * @param {string} data - The data to encrypt.
 * @param {Object} [options={}] - Additional options for encryption.
 * @param {string} [options.algorithm="aes-128-cbc"] - The encryption algorithm to use.
 * @param {Buffer} [options.key=Buffer.alloc(16)] - The encryption key.
 * @param {Buffer} [options.iv=Buffer.alloc(16)] - The initialization vector (IV).
 * @param {string} [options.encoding="hex"] - The encoding type for the encrypted data.
 * @returns {string} The encrypted data string.
 */
function encrypt(data, options = {}) {
    const { algorithm = "aes-128-cbc", key = Buffer.alloc(16), iv = Buffer.alloc(16), encoding = "hex" } = options;
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString(encoding);
}

/**
 * Decrypts data using the specified algorithm, key, IV, and encoding.
 *
 * @param {string} data - The data to decrypt.
 * @param {Object} [options={}] - Additional options for decryption.
 * @param {string} [options.algorithm="aes-128-cbc"] - The decryption algorithm to use.
 * @param {Buffer} [options.key=Buffer.alloc(16)] - The decryption key.
 * @param {Buffer} [options.iv=Buffer.alloc(16)] - The initialization vector (IV).
 * @param {string} [options.encoding="hex"] - The encoding type of the decrypted data.
 * @returns {string} The decrypted data string.
 */
function decrypt(data, options = {}) {
    const { algorithm = "aes-128-cbc", key = Buffer.alloc(16), iv = Buffer.alloc(16), encoding = "hex" } = options;
    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(data, encoding), cipher.final()]).toString();
}

/**
 * Encrypts data using a private key.
 *
 * @param {string} data - The data to encrypt.
 * @param {Object} [options={}] - Additional options for encryption.
 * @param {Buffer|string} key - The private key used for encryption.
 * @param {string} [options.encoding="hex"] - The encoding type for the encrypted data.
 * @returns {string} The encrypted data string.
 */
function privateEncrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.privateEncrypt(key, Buffer.from(data)).toString(encoding);
}

/**
 * Decrypts data using a public key.
 *
 * @param {string} data - The data to decrypt.
 * @param {Object} [options={}] - Additional options for decryption.
 * @param {Buffer|string} key - The public key used for decryption.
 * @param {string} [options.encoding="hex"] - The encoding type of the encrypted data.
 * @returns {string} The decrypted data string.
 */
function publicDecrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.publicDecrypt(key, Buffer.from(data, encoding)).toString();
}

/**
 * Encrypts data using a public key.
 *
 * @param {string} data - The data to encrypt.
 * @param {Object} [options={}] - Additional options for encryption.
 * @param {Buffer|string} key - The public key used for encryption.
 * @param {string} [options.encoding="hex"] - The encoding type for the encrypted data.
 * @returns {string} The encrypted data string.
 */
function publicEncrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.publicEncrypt(key, Buffer.from(data)).toString(encoding);
}

/**
 * Decrypts data using a private key.
 *
 * @param {string} data - The data to decrypt.
 * @param {Object} [options={}] - Additional options for decryption.
 * @param {Buffer|string} key - The private key used for decryption.
 * @param {string} [options.encoding="hex"] - The encoding type of the encrypted data.
 * @returns {string} The decrypted data string.
 */
function privateDecrypt(data, options = {}) {
    const { key, encoding = "hex" } = options;
    return crypto.privateDecrypt(key, Buffer.from(data, encoding)).toString();
}

/**
 * Signs data using a specified algorithm and key.
 *
 * @param {string} data - The data to sign.
 * @param {Object} [options={}] - Additional options for signing.
 * @param {string} [options.algorithm="sha256"] - The signing algorithm to use.
 * @param {Buffer|string} key - The key used for signing.
 * @param {string} [options.encoding="hex"] - The encoding type for the signature.
 * @returns {Buffer} The signature.
 */
function sign(data, options = {}) {
    const { algorithm = "sha256", key, encoding = "hex" } = options;
    const sign = crypto.createSign(algorithm);
    sign.write(data);
    sign.end();
    return sign.sign(key, encoding);
}

/**
 * Verifies the signature of data using a specified algorithm, key, and signature.
 *
 * @param {string} data - The data to verify.
 * @param {Buffer} signature - The signature to verify against.
 * @param {Object} [options={}] - Additional options for verification.
 * @param {string} [options.algorithm="sha256"] - The verification algorithm to use.
 * @param {Buffer|string} key - The key used for verification.
 * @param {string} [options.encoding="hex"] - The encoding type of the signature.
 * @returns {boolean} A boolean indicating if the signature is valid.
 */
function verify(data, signature, options = {}) {
    const { algorithm = "sha256", key, encoding = "hex" } = options;
    const verify = crypto.createVerify(algorithm);
    verify.write(data);
    verify.end();
    return verify.verify(key, signature, encoding);
}

/**
 * Computes the hash of data using a specified algorithm.
 *
 * @param {string} data - The data to hash.
 * @param {Object} [options={}] - Additional options for hashing.
 * @param {string} [options.algorithm="sha256"] - The hashing algorithm to use.
 * @param {string} [options.encoding="hex"] - The encoding type for the hash.
 * @returns {Buffer} The hash value.
 */
function hash(data, options = {}) {
    const { algorithm = "sha256", encoding = "hex" } = options;
    return crypto.createHash(algorithm).update(data).digest(encoding);
}

/**
 * Computes a Hash-based Message Authentication Code (HMAC) using a specified algorithm and key.
 *
 * @param {string} data - The data to create an HMAC for.
 * @param {Object} [options={}] - Additional options for HMAC.
 * @param {string} [options.algorithm="sha256"] - The HMAC algorithm to use.
 * @param {string} [options.key=""] - The key used for the HMAC.
 * @param {string} [options.encoding="hex"] - The encoding type for the HMAC.
 * @returns {Buffer} The HMAC value.
 */
function hmac(data, options = {}) {
    const { algorithm = "sha256", key = "", encoding = "hex" } = options;
    return crypto.createHmac(algorithm, key).update(data).digest(encoding);
}

module.exports = {
    toDataView,
    base32Encode,
    readChar,
    base32Decode,
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

// // Usage example
// var data = "string";
// var { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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
// data = encode(data);
// console.log(data);
// data = decode(data);
// console.log(data);
// data = encrypt(data);
// console.log(data);
// data = decrypt(data);
// console.log(data);
// data = privateEncrypt(data, { key: privateKey });
// console.log(data);
// data = publicDecrypt(data, { key: publicKey });
// console.log(data);
// data = publicEncrypt(data, { key: publicKey });
// console.log(data);
// data = privateDecrypt(data, { key: privateKey });
// console.log(data);
// var signature = sign(data, { key: privateKey });
// console.log(signature);
// var verified = verify(data, signature, { key: privateKey });
// console.log(verified);
// data = hash(data);
// console.log(data);
// data = hmac(data);
// console.log(data);
// var data = "username:password";
// data = encode(data, { encoding: "base64" });
// console.log(data);
