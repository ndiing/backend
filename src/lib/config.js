const { read } = require("./helper");

let config = read("./config.json", {
    httpPort: 80,
    httpsPort: 443,
    httpProxy: "http://127.0.0.1:8888",
});

module.exports = config;
