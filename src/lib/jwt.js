const crypto = require("crypto");
const Crypto = require("./crypto");

/**
 * A set of algorithms for signing and verifying data using different cryptographic methods.
 * @typedef {Object} Algorithms
 * @property {Object} HS256 - Algorithm using HMAC with SHA-256.
 * @property {Object} HS384 - Algorithm using HMAC with SHA-384.
 * @property {Object} HS512 - Algorithm using HMAC with SHA-512.
 * @property {Object} RS256 - Algorithm using RSA with SHA-256.
 * @property {Object} RS384 - Algorithm using RSA with SHA-384.
 * @property {Object} RS512 - Algorithm using RSA with SHA-512.
 * @property {Object} ES256 - Algorithm using ECDSA with SHA-256.
 * @property {Object} ES384 - Algorithm using ECDSA with SHA-384.
 * @property {Object} ES512 - Algorithm using ECDSA with SHA-512.
 * @property {Object} PS256 - Algorithm using RSA-PSS with SHA-256.
 * @property {Object} PS384 - Algorithm using RSA-PSS with SHA-384.
 * @property {Object} PS512 - Algorithm using RSA-PSS with SHA-512.
 */
const algs = {
    HS256: {
        sign(data, options) {
            const { secret: key } = options;
            return Crypto.hmac(data, { algorithm: "sha256", key, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const { secret: key } = options;
            return Crypto.hmac(data, { algorithm: "sha256", key, encoding: "base64url" }) === signature;
        },
    },
    HS384: {
        sign(data, options) {
            const { secret: key } = options;
            return Crypto.hmac(data, { algorithm: "sha384", key, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const { secret: key } = options;
            return Crypto.hmac(data, { algorithm: "sha384", key, encoding: "base64url" }) === signature;
        },
    },
    HS512: {
        sign(data, options) {
            const { secret: key } = options;
            return Crypto.hmac(data, { algorithm: "sha512", key, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const { secret: key } = options;
            return Crypto.hmac(data, { algorithm: "sha512", key, encoding: "base64url" }) === signature;
        },
    },
    RS256: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha256", key, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha256", key, encoding: "base64url" });
        },
    },
    RS384: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha384", key, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha384", key, encoding: "base64url" });
        },
    },
    RS512: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha512", key, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha512", key, encoding: "base64url" });
        },
    },
    ES256: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha256", key: { key, dsaEncoding: "ieee-p1363", padding: crypto.constants.RSA_PKCS1_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST }, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha256", key: { key, dsaEncoding: "ieee-p1363", padding: crypto.constants.RSA_PKCS1_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST }, encoding: "base64url" });
        },
    },
    ES384: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha384", key: { key, dsaEncoding: "ieee-p1363", padding: crypto.constants.RSA_PKCS1_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST }, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha384", key: { key, dsaEncoding: "ieee-p1363", padding: crypto.constants.RSA_PKCS1_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST }, encoding: "base64url" });
        },
    },
    ES512: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha512", key: { key, dsaEncoding: "ieee-p1363", padding: crypto.constants.RSA_PKCS1_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST }, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha512", key: { key, dsaEncoding: "ieee-p1363", padding: crypto.constants.RSA_PKCS1_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST }, encoding: "base64url" });
        },
    },
    PS256: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha256", key: { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha256", key: { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, encoding: "base64url" });
        },
    },
    PS384: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha384", key: { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha384", key: { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, encoding: "base64url" });
        },
    },
    PS512: {
        sign(data, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.sign(data, { algorithm: "sha512", key: { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, encoding: "base64url" });
        },
        verify(data, signature, options) {
            const {
                secret: { key },
            } = options;
            return Crypto.verify(data, signature, { algorithm: "sha512", key: { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, encoding: "base64url" });
        },
    },
};

/**
 * Encodes a payload and header into a JSON Web Token (JWT).
 *
 * @param {Object} payload - The payload object to be encoded.
 * @param {Object} options - Options for encoding the token.
 * @param {Object} options.header - The header object containing the algorithm.
 * @param {string} options.secret - The secret key for signing the token.
 * @returns {string} The generated JSON Web Token (JWT).
 */
function encode(payload, options = {}) {
    let { header } = options;
    
    const method = algs[header.alg];
    
    payload = JSON.stringify(payload);
    payload = Crypto.encode(payload, { encoding: "base64url" });
    
    header = JSON.stringify(header);
    header = Crypto.encode(header, { encoding: "base64url" });
    
    const data = [header, payload].join(".");
    
    const signature = method.sign(data, options);
    
    return [data, signature].join(".");
}

/**
 * Decodes a JSON Web Token (JWT) and verifies its integrity.
 *
 * @param {string} token - The JWT to be decoded and verified.
 * @param {Object} options - Options for decoding the token.
 * @param {string} options.secret - The secret key for verifying the token.
 * @returns {Object} The payload object extracted from the decoded token.
 * @throws {Error} Throws an error if the token signature is invalid.
 */
function decode(token, options = {}) {
    let [header, payload, signature] = token.split(".");
    
    const data = [header, payload].join(".");
    
    header = Crypto.decode(header, { encoding: "base64url" });
    header = JSON.parse(header);
    
    const method = algs[header.alg];
    
    const verfied = method.verify(data, signature, options);
    
    payload = Crypto.decode(payload, { encoding: "base64url" });
    payload = JSON.parse(payload);
    
    if (!verfied) {
        throw new Error("Invalid Signature");
    }
    
    return payload;
}
module.exports = { encode, decode };

// // Usage example
// var header={
//     alg:'HS256'
// }
// var secret='secret'
// var token = encode({},{header,secret})
// console.log(token)
// var payload = decode(token,{secret})
// console.log(payload)
