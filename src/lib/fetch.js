const config = require("./config.js");
const { read, write } = require("./helper.js");
const Request = require("./request.js");
const Response = require("./response.js");
const CookieStore = require("./cookie-store.js");
const ObjectObserver = require("./object-observer.js");

/**
 * Membuat store yang terhubung dengan file JSON untuk menyimpan dan mengelola data.
 *
 * @param {string} filename - Nama file tempat data akan disimpan dan dibaca.
 * @returns {Proxy} - Sebuah proxy untuk mengamati dan mengelola objek store.
 */
function createStore(filename) {
    const target = read(filename, {});

    target.cookieStore = new CookieStore(target.cookieStore);

    const proxy = new ObjectObserver(target, (newTarget) => {
        write(filename, newTarget);
    });

    return proxy;
}

// test store

// // passed
// {
//     const store = createStore('./data/data.json')
//     // store.name='value'
//     console.log(store)
// }

/**
 * Melakukan permintaan HTTP dan mengembalikan respons.
 *
 * @param {string|URL} resource - URL atau sumber daya yang akan diambil.
 * @param {object} [options={}] - Opsi tambahan untuk permintaan.
 * @param {string} [options.credentials="same-origin"] - Menentukan apakah kredensial (seperti cookies) harus disertakan.
 * @param {object} [options.store] - Objek penyimpanan yang dapat digunakan untuk menyimpan cookies.
 * @param {string} [options.method="GET"] - Metode HTTP yang akan digunakan (GET, POST, dll.).
 * @param {number} [options.follow=30] - Jumlah maksimum pengalihan yang diizinkan.
 * @returns {Promise<Response>} - Promise yang mengembalikan objek Response.
 */
function fetch(resource, options = {}) {
    return new Promise(async (resolve, reject) => {
        const request = new Request(resource, options);

        if (options.credentials !== "omit" && options.store) {
            const cookie = options.store?.cookieStore?.cookie;
            if (cookie) {
                request.headers.set("Cookie", cookie);
            }
        }

        // process.env.HTTP_PROXY
        // const process.env.HTTP_PROXY = null; //'http://127.0.0.1:8888'
        if (config.httpProxy) {
            const request2 = new Request(config.httpProxy, {
                method: "CONNECT",
            });
            request2.path = [request.hostname, request.port].join(":");

            // overwrite host
            request.hostname = request2.hostname;
            request.port = request2.port;

            // console.log(request)
            // console.log(request2)

            if (request.protocol === "https:") {
                const agent = await new Promise((resolve, reject) => {
                    const req2 = request2.client.request(request2);

                    req2.on("error", reject);
                    req2.on("timeout", () => req2.destroy());
                    req2.on("connect", (req, socket, head) => {
                        const Agent = request.client.Agent;
                        const agent = new Agent({
                            rejectUnauthorized: false,
                            keepAlive: true,
                            socket,
                        });
                        resolve(agent);
                    });

                    request2.body.pipe(req2);
                });
                // replace
                request.agent = agent;
            }
        }

        const req = request.client.request(request);

        req.on("error", reject);
        req.on("timeout", () => req.destroy());
        req.on("response", (res) => {
            let response = new Response(res, {
                headers: res.headers,
                status: res.statusCode,
                statusText: res.statusMessage,
                url: request.url,
            });

            // // Set-Cookie
            const setCookie = response.headers.getSetCookie();
            if (options.credentials !== "omit" && options.store?.cookieStore && setCookie.length) {
                options.store.cookieStore.cookie = setCookie;
            }

            // Location
            if (response.headers.has("Location") && request.redirect === "follow" && request.follow > 0) {
                --request.follow;
                const location = response.headers.get("Location");
                resource = new URL(location, request.origin);
                response = fetch(resource, {
                    follow: request.follow,
                    store: options.store,
                });
            }

            resolve(response);
        });

        request.body.pipe(req);
    });
}

fetch.createStore = createStore;

module.exports = fetch;

// test fetch

// // test signal // passed
// {
//     const abortController = new AbortController()
//     fetch('http://google.com',{
//         signal:abortController.signal
//     })
//     .then(console.log)
//     .catch(console.log)
//     abortController.abort()
// }

// // passed
// {
//     const store = createStore('./data/data.json')

//     fetch('http://google.com',{
//         store
//     })
//     .then(console.log)
//     .catch(console.log)
// }

// // test compression
// // passed
// {
//     fetch('https://jsonplaceholder.typicode.com/posts/1',{
//         headers:{
//             'Accept-Encoding':'br'
//         }
//     })
//     .then(res=>res.text())
//     .then(console.log)
//     .catch(console.log)

//     fetch('https://jsonplaceholder.typicode.com/posts/1',{
//         headers:{
//             'Accept-Encoding':'gzip'
//         }
//     })
//     .then(res=>res.text())
//     .then(console.log)
//     .catch(console.log)

//     fetch('https://jsonplaceholder.typicode.com/posts/1',{
//         headers:{
//             'Accept-Encoding':'deflate'
//         }
//     })
//     .then(res=>res.text())
//     .then(console.log)
//     .catch(console.log)
// }

// // passed
// {
//     // fetch('https://jsonplaceholder.typicode.com/posts/1') .then((response) => response.json()) .then((json) => console.log(json));
//     fetch('https://jsonplaceholder.typicode.com/posts') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts', { method: 'POST', body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'PUT', body: JSON.stringify({ id: 1, title: 'foo', body: 'bar', userId: 1, }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'PATCH', body: JSON.stringify({ title: 'foo', }), headers: { 'Content-type': 'application/json; charset=UTF-8', }, }) .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'DELETE', }).then((response) => response.json()) .then((json) => console.log(json));;
//     // fetch('https://jsonplaceholder.typicode.com/posts?userId=1') .then((response) => response.json()) .then((json) => console.log(json));
//     // fetch('https://jsonplaceholder.typicode.com/posts/1/comments') .then((response) => response.json()) .then((json) => console.log(json));
// }
