const forge = require("node-forge");

const Util = {
    /**
     * Mengecek apakah domain adalah alamat IP.
     *
     * @param {string} [domain=""] - Domain atau alamat IP.
     * @returns {boolean} - True jika domain adalah alamat IP, false jika bukan.
     */
    isIpDomain: function (domain = "") {
        const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;

        return ipReg.test(domain);
    },
};

let defaultAttrs = [
    { name: "countryName", value: "ID" },
    { name: "organizationName", value: "Ndiing" },
    { shortName: "ST", value: "JT" },
    { shortName: "OU", value: "Ndiing" },
];

/**
 * Mendapatkan ekstensi Subject Alternative Name (SAN) untuk domain atau IP.
 *
 * @param {string} [domain=""] - Domain atau alamat IP.
 * @returns {Object} - Ekstensi SAN yang berisi nama alternatif subjek.
 */
function getExtensionSAN(domain = "") {
    const isIpDomain = Util.isIpDomain(domain);
    if (isIpDomain) {
        return {
            name: "subjectAltName",
            altNames: [{ type: 7, ip: domain }],
        };
    } else {
        return {
            name: "subjectAltName",
            altNames: [{ type: 2, value: domain }],
        };
    }
}

/**
 * Menghasilkan pasangan kunci dan sertifikat.
 *
 * @param {string} [serialNumber] - Nomor seri sertifikat, jika tidak diberikan akan dihasilkan secara acak.
 * @returns {Object} - Objek berisi kunci (privateKey dan publicKey) dan sertifikat.
 */
function getKeysAndCert(serialNumber) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = serialNumber || Math.floor(Math.random() * 100000) + "";
    var now = Date.now();
    cert.validity.notBefore = new Date(now - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now + 824 * 24 * 60 * 60 * 1000);
    return {
        keys,
        cert,
    };
}

/**
 * Menghasilkan Root Certificate Authority (CA).
 *
 * @param {string} [commonName] - Nama umum untuk sertifikat Root CA.
 * @returns {Object} - Objek yang berisi privateKey, publicKey, dan sertifikat Root CA.
 */
function generateRootCA(commonName) {
    const keysAndCert = getKeysAndCert();
    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;

    commonName = commonName || "CertManager";

    const attrs = defaultAttrs.concat([
        {
            name: "commonName",
            value: commonName,
        },
    ]);
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{ name: "basicConstraints", cA: true }]);

    cert.sign(keys.privateKey, forge.md.sha256.create());

    return {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert),
    };
}

/**
 * Menghasilkan sertifikat untuk hostname berdasarkan Root CA.
 *
 * @param {string} domain - Nama domain atau IP yang akan digunakan dalam sertifikat.
 * @param {Object} rootCAConfig - Konfigurasi Root CA yang berisi sertifikat dan kunci private.
 * @returns {Object} - Objek berisi privateKey, publicKey, dan sertifikat untuk hostname.
 */
function generateCertsForHostname(domain, rootCAConfig) {
    const md = forge.md.md5.create();
    md.update(domain);

    const keysAndCert = getKeysAndCert(md.digest().toHex());
    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;

    const caCert = forge.pki.certificateFromPem(rootCAConfig.cert);
    const caKey = forge.pki.privateKeyFromPem(rootCAConfig.key);

    cert.setIssuer(caCert.subject.attributes);

    const attrs = defaultAttrs.concat([
        {
            name: "commonName",
            value: domain,
        },
    ]);

    const extensions = [{ name: "basicConstraints", cA: false }, getExtensionSAN(domain)];

    cert.setSubject(attrs);
    cert.setExtensions(extensions);

    cert.sign(caKey, forge.md.sha256.create());

    return {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert),
    };
}

/**
 * Mengubah atribut default yang digunakan dalam pembuatan sertifikat.
 *
 * @param {Array<Object>} attrs - Array objek atribut yang baru.
 */
function setDefaultAttrs(attrs) {
    defaultAttrs = attrs;
}

module.exports = {
    getExtensionSAN,
    getKeysAndCert,
    generateRootCA,
    generateCertsForHostname,
    setDefaultAttrs,
};

// Usage example
// ;(() => {
//     const fs = require('fs')

//     const root = generateRootCA()
//     const host = generateCertsForHostname('locahost',{
//         key: root.privateKey,
//         cert: root.certificate,
//     })

//     fs.writeFileSync('./root.key',root.privateKey)
//     fs.writeFileSync('./root.crt',root.certificate)
//     fs.writeFileSync('./host.key',host.privateKey)
//     fs.writeFileSync('./host.crt',host.certificate)
// })()
