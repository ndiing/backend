const { read, write } = require("./file");
const { flatten, unflatten, installTrustedRootCertificate, replacer } = require("./helper");
const { generateRootCA, generateCertsForHostname } = require("./cert");
const fs = require("fs");

const version = "1.0.0";
const config = read("./config.json", {
    version,
    http: {
        port: 80,
    },
    https: {
        port: 443,
        options: {
            key: null,
            cert: null,
        },
    },
    accessControl: [
        {
            method: /.*/,
            url: /.*/,
            whitelist: [/^(?:127(?:\.(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])){3}|(?:10|192\.168)(?:\.(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])){2})$/],
        },
    ],
});

if (config.version !== version) {
    config.version = version;
    write("./config.json", config);
}

try {
    config.https.options.key = fs.readFileSync("./host.key");
    config.https.options.cert = fs.readFileSync("./host.crt");
} catch (error) {
    const root = generateRootCA();

    fs.writeFileSync("./root.key", root.key);
    fs.writeFileSync("./root.crt", root.cert);

    installTrustedRootCertificate();

    const host = generateCertsForHostname("localhost", root);

    fs.writeFileSync("./host.key", host.key);
    fs.writeFileSync("./host.crt", host.cert);

    config.https.options.key = host.key;
    config.https.options.cert = host.cert;
}

module.exports = config;
