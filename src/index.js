process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

const http = require("http");
const https = require("https");
const express = require("express");
const config = require("./lib/config");
const { auth, init, missing, error } = require("./lib/middleware");
require("./lib");
require("./dev");

const app = express();

app.use(init());
app.use(auth());

app.use("/api", require("./api"));

app.use(missing());
app.use(error());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(config.https.options, app);

httpServer.listen(config.http.port, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(config.https.port, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
