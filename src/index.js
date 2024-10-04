process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

const Router = require("./lib/router.js");
const { compression, messages, cookies, security, cors, authorization, fallback, catchAll } = require("./lib/middleware.js");
const fs = require("fs");
const http = require("http");
const https = require("https");

if (process.env.NODE_ENV === "development") {
    require("./lib/index.js");
}

const options = {
    key: fs.readFileSync("./host.key"),
    cert: fs.readFileSync("./host.crt"),
};

const app = new Router();

app.use(compression(), messages(), cookies(), security(), cors(), authorization());

app.use("/blogs", require("./api/blogs/index.js"));
app.use("/", require("./api/main/index.js"));

app.use(fallback(), catchAll());

const httpServer = http.createServer(app.handleRequest.bind(app));
const httpsServer = https.createServer(options, app.handleRequest.bind(app));

httpServer.listen(80, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(443, "0.0.0.0", () => {
    console.log(httpsServer.address());
});

// // router test
// (() => {
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//     // fetch('http://localhost/1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost', { method: 'POST', body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/1', { method: 'PUT', body: JSON.stringify({ id: 1, title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/1', { method: 'PATCH', body: JSON.stringify({ title: 'foo', }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/1', { method: 'DELETE', }).then((response) => response.json()) .then((json) => console.log(json));;
//     // fetch('http://localhost?userId=1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/1/comments') .then((response) => response.json()) .then((json) => console.log(json));

//     // fetch('http://localhost/blogs/1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/blogs') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/blogs', { method: 'POST', body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/blogs/1', { method: 'PUT', body: JSON.stringify({ id: 1, title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/blogs/1', { method: 'PATCH', body: JSON.stringify({ title: 'foo', }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/blogs/1', { method: 'DELETE', }).then((response) => response.json()) .then((json) => console.log(json));;
//     // fetch('http://localhost/blogs?userId=1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('http://localhost/blogs/1/comments') .then((response) => response.json()) .then((json) => console.log(json));

//     // // cookies passed
//     // fetch('http://localhost',{
//     //     headers:{
//     //         'Cookie':'name=value; name1=value1; name2=value2'
//     //     }
//     // })
//     // .then((response) => {
//     //     console.log(response)
//     //     return response.json()
//     // })
//     // .then((json) => console.log(json))

//     // // compression passed
//     // fetch('http://localhost',{
//     //     headers:{
//     //         'Accept-Encoding':'br'
//     //     }
//     // })
//     // .then((response) => response.json())
//     // .then((json) => console.log(json))

//     // fetch('http://localhost',{
//     //     headers:{
//     //         'Accept-Encoding':'gzip'
//     //     }
//     // })
//     // .then((response) => response.json())
//     // .then((json) => console.log(json))

//     // fetch('http://localhost',{
//     //     headers:{
//     //         'Accept-Encoding':'deflate'
//     //     }
//     // })
//     // .then((response) => response.json())
//     // .then((json) => console.log(json))

//     // request body passed
//     // fetch("http://localhost", {
//     //     method: "POST",
//     //     body: JSON.stringify({
//     //         title: "foo",
//     //         body: "bar",
//     //         userId: 1,
//     //     }),
//     //     headers: {
//     //         "Content-type": "application/json",
//     //     },
//     // })
//     //     .then((response) => response.json())
//     //     .then((json) => console.log(json));

//     // fetch("http://localhost", {
//     //     method: "POST",
//     //     body: new URLSearchParams({
//     //         title: "foo",
//     //         body: "bar",
//     //         userId: 1,
//     //     }).toString(),
//     //     headers: {
//     //         "Content-type": "application/x-www-form-urlencoded",
//     //     },
//     // })
//     //     .then((response) => response.json())
//     //     .then((json) => console.log(json));
// })();
