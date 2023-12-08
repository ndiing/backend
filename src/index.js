process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

const http = require("http");
const https = require("https");
const express = require("express");
const config = require("./lib/config");
const { auth, body, notFound, internalServerError } = require("./lib/middleware");
require("./lib");
require("./dev");

const app = express();

app.use(require("cors")());
app.use(require("helmet")());

app.use(body());

app.use(auth());

app.use("/api", require("./api"));

app.use(notFound());
app.use(internalServerError());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(config.https.options, app);

httpServer.listen(config.http.port, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(config.https.port, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
