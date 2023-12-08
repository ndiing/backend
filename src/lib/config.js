const { read, write } = require("./file");
const { flatten, unflatten } = require("./helper");

const version = "1.0.0";
const config = unflatten(
    read("./config.json", {
        version,
        http: { port: 80 },
        https: { port: 443, options: { key: null, cert: null } },
    })
);

if (config.version !== version) {
    config.version = version;
    write("./config.json", flatten(config));
}

module.exports = config;
