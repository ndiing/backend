const { read, write } = require("./file");
const { flatten, unflatten } = require("./helper");
const { generateRootCA, generateCertsForHostname } = require("./cert");
const fs = require("fs");

const version = "1.0.0";

const config = unflatten(
    read("./config.json", {
        version: "1.0.0",
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
        proxy: {
            protocol: "http:",
            hostname: "127.0.0.1",
            port: 8888,
            url: "http://127.0.0.1:8888",
        },
    })
);

config.https.options.key = fs.readFileSync("./host.key");
config.https.options.cert = fs.readFileSync("./host.crt");

if (config.version !== version) {
    config.version = version;
    write("./config.json", flatten(config));
}

module.exports = config;

// const ca = generateRootCA()
// write('./root.key',ca.key)
// write('./root.crt',ca.cert)
// const host=generateCertsForHostname('localhost',ca)
// write('./host.key',host.key)
// write('./host.crt',host.cert)
