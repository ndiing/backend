const { read } = require("./helper");

const config = read("./config.json", {
    httpPort: 80,
    httpsPort: 443,
});

module.exports = config;

// {
//     console.log(config)
// }
