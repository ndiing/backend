const Router = require("./lib/router.js");
require("./lib/index.js");


const http = require("http");
const https = require("https");
const fs = require("fs");

// pindahkan bagian ini
// dan semua middleware nanti...
const { Readable } = require("stream");
const zlib = require("zlib");

const options = {
    key: fs.readFileSync("./host.key"),
    cert: fs.readFileSync("./host.crt"),
};

const app = new Router();

// dev start

// http compression
app.use((req, res, next) => {
    try {

        // overwrite send
        // add compression

        res.send = (body) => {
            if (typeof body === 'string') {
                const readable = new Readable()
                readable.push(body)
                readable.push(null)
                body = readable
            }

            // handle compression based request
            const acceptEncoding = req.headers['accept-encoding'] ?? ''

            if (/\bbr\b/.test(acceptEncoding)) {
                res.setHeader('Content-Encoding', 'br')
                body = body.pipe(zlib.createBrotliCompress())
            }
            else if (/\bgzip\b/.test(acceptEncoding)) {
                res.setHeader('Content-Encoding', 'gzip')
                body = body.pipe(zlib.createGzip())
            }
            else if (/\bdeflate\b/.test(acceptEncoding)) {
                res.setHeader('Content-Encoding', 'deflate')
                body = body.pipe(zlib.createDeflate())
            }

            body.pipe(res)
        }

        next()
    } catch (error) {
        next(error)
    }
})

// http message / body parser
app.use(async (req, res, next) => {
    try {
        // buat pengangan request body

        const methods = ["POST", "PATCH", "PUT"];

        if (methods.includes(req.method)) {
            const chunks = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }

            const buffer = Buffer.concat(chunks);

            // buffer
            // payload base on mime type
            const contentType = req.headers["content-type"] ?? "";

            if (contentType.includes("application/json")) {
                req.body = JSON.parse(buffer);
            } else if (contentType.includes("application/x-www-form-urlencoded")) {
                // kurang relevan, perlu dikembangkan oleh developer
                req.body = Object.fromEntries(new URLSearchParams(buffer.toString()).entries());
            }
        }

        next();
    } catch (error) {
        next();
    }
});

// http cookies
const COOKIE_ATTRIBUTES = {
    domain: 'Domain',
    expires: 'Expires',
    httpOnly: 'HttpOnly',
    maxAge: 'Max-Age',
    partitioned: 'Partitioned',
    path: 'Path',
    secure: 'Secure',
    sameSite: 'SameSite',
}

app.use((req, res, next) => {
    try {

        // buat penanganan cookies
        req.cookies = {}

        const cookie = req.headers['cookie'] ?? ''

        if (cookie) {
            for (const [, name, value] of cookie.matchAll(/([^= ]+)=([^;]+)/g)) {
                req.cookies[name] = value
            }
        }

        const setCookie = []
        res.cookie = (name, value, attributes = {}) => {
            const array = []
            array.push([name, value].join('='))
            for (const name in attributes) {
                const value = attributes[name]
                // validate name
                const key = COOKIE_ATTRIBUTES[name]
                if (!key) {
                    continue
                }
                array.push([key, value].join('='))
            }
            setCookie.push(array.join('; '))
            res.setHeader('Set-Cookie', setCookie)
        }


        next()
    } catch (error) {
        next(error)
    }
})

// dev end

app.use("/blogs", require("./api/blogs/index.js"));

app.post("/", (req, res, next) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        message: "post"
    });
});
app.get("/:id", (req, res, next) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        message: "get"
    });
});
app.get("/", (req, res, next) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        message: "get"
    });
});
app.patch("/:id", (req, res, next) => {
    res.json({ message: "patch" });
});
app.delete("/:id", (req, res, next) => {
    res.json({ message: "delete" });
});
app.put("/:id", (req, res, next) => {
    res.json({ message: "put" });
});

app.use((req, res, next) => {
    res.statusCode = 404;
    next(new Error("Tidak ditemukan"));
});
app.use((err, req, res, next) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
        res.statusCode = 500;
    }
    err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.json({ message: err.message });
});

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
