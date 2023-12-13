const forge = require("node-forge");

let defaultAttrs = [
    { name: "countryName", value: "ID" },
    { name: "organizationName", value: "Ndiing" },
    { shortName: "ST", value: "JT" },
    { shortName: "OU", value: "Ndiing" },
];

/**
 * Checks if the given domain is an IP address.
 *
 * @param {string} [domain=""] - The domain to check.
 * @returns {boolean} True if the domain is an IP address, otherwise false.
 */
function isIpDomain(domain = "") {
    const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;
    return ipReg.test(domain);
}

/**
 * Generates the subjectAltName extension based on the domain type.
 *
 * @param {string} [domain=""] - The domain to generate the extension for.
 * @returns {Object} An object containing the subjectAltName extension details.
 */
function getExtensionSAN(domain = "") {
    const isIp = isIpDomain(domain);
    if (isIp) {
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
 * Generates RSA key pair and a certificate.
 *
 * @param {string} [serialNumber] - The serial number for the certificate.
 * @returns {Object} An object containing the generated keys and certificate.
 */
function getKeysAndCert(serialNumber) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = serialNumber || Math.floor(Math.random() * 100000) + "";

    const now = Date.now();
    
    cert.validity.notBefore = new Date(now - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now + 824 * 24 * 60 * 60 * 1000);
    return {
        keys,
        cert,
    };
}

/**
 * Generates a root certificate authority (CA) with specified common name.
 *
 * @param {string} [commonName="CertManager"] - The common name for the root CA.
 * @returns {Object} An object containing the root CA's private key and certificate.
 */
function generateRootCA(commonName) {
    commonName = commonName || "CertManager";

    const keysAndCert = getKeysAndCert();
    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;
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
        key: forge.pki.privateKeyToPem(keys.privateKey),
        cert: forge.pki.certificateToPem(cert),
    };
}

/**
 * Generates certificates for a specific hostname signed by a root CA.
 *
 * @param {string} domain - The hostname for which the certificate is generated.
 * @param {Object} rootCAConfig - Configuration for the root CA.
 * @returns {Object} An object containing the private key and certificate for the given domain.
 */
function generateCertsForHostname(domain, rootCAConfig) {
    const md = forge.md.md5.create();
    md.update(domain);

    const keysAndCert = getKeysAndCert(md.digest().toHex());
    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;
    const caCert = forge.pki.certificateFromPem(rootCAConfig.cert);
    const caKey = forge.pki.privateKeyFromPem(rootCAConfig.key);
    const attrs = defaultAttrs.concat([
        {
            name: "commonName",
            value: domain,
        },
    ]);
    const extensions = [
        { name: "basicConstraints", cA: false },
        getExtensionSAN(domain),
    ];

    cert.setIssuer(caCert.subject.attributes);
    cert.setSubject(attrs);
    cert.setExtensions(extensions);
    cert.sign(caKey, forge.md.sha256.create());
    return {
        key: forge.pki.privateKeyToPem(keys.privateKey),
        cert: forge.pki.certificateToPem(cert),
    };
}

module.exports = {
    isIpDomain,
    getExtensionSAN,
    getKeysAndCert,
    generateRootCA,
    generateCertsForHostname,
};

// // Usage example
// const ca = generateRootCA();
// const root = generateCertsForHostname("localhost", ca);
// console.log(ca);
// console.log(root);
