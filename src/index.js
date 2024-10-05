process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

const config = require("./lib/config.js");
const Router = require("./lib/router.js");
const { compression, messages, cookies, security, cors, authorization, fallback, catchAll } = require("./lib/middleware.js");
const fs = require("fs");
const http = require("http");
const https = require("https");

if (process.env.NODE_ENV === "development") {
    require("./lib/index.js");
}

const options = { key: fs.readFileSync("./host.key"), cert: fs.readFileSync("./host.crt") };

const app = new Router();

app.use(compression(), messages(), cookies(), security(), cors(), authorization());
app.use("/blogs", require("./api/blogs/index.js"));
app.use("/", require("./api/main/index.js"));
app.use(fallback(), catchAll());

// app.get('/',(req,res) => {
//     res.json({message:'ok'})
// })

const httpServer = http.createServer(app.handleRequest.bind(app));
const httpsServer = https.createServer(options, app.handleRequest.bind(app));

httpServer.listen(config.httpPort, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(config.httpsPort, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
