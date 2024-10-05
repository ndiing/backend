## Classes

<dl>
<dt><a href="#CookieStore">CookieStore</a></dt>
<dd><p>Kelas untuk mengelola penyimpanan cookie sebagai objek.</p>
</dd>
<dt><a href="#Headers">Headers</a></dt>
<dd><p>Kelas untuk mengelola header HTTP sebagai objek.</p>
</dd>
<dt><a href="#ObjectObserver">ObjectObserver</a></dt>
<dd><p>Kelas untuk mengawasi perubahan pada objek dan menjalankan callback saat terjadi perubahan.</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd><p>Kelas untuk membuat dan mengelola permintaan HTTP/HTTPS.</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>Kelas untuk menangani respons dari permintaan HTTP/HTTPS.</p>
</dd>
<dt><a href="#Router">Router</a></dt>
<dd><p>Kelas untuk menangani routing dalam aplikasi HTTP.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#signer">signer</a> : <code>Object</code></dt>
<dd><p>Objek untuk menandatangani data menggunakan berbagai algoritma.</p>
</dd>
<dt><a href="#verifier">verifier</a> : <code>Object</code></dt>
<dd><p>Objek untuk memverifikasi tanda tangan menggunakan berbagai algoritma.</p>
</dd>
<dt><a href="#Validators">Validators</a></dt>
<dd><p>Objek berisi validator untuk memeriksa nilai.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#generateRootCA">generateRootCA([commonName])</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan sertifikat Certificate Authority (CA) root.</p>
</dd>
<dt><a href="#generateCertsForHostname">generateCertsForHostname(domain, rootCAConfig)</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan sertifikat untuk hostname yang ditentukan menggunakan konfigurasi CA root.</p>
</dd>
<dt><a href="#getProxyServer">getProxyServer()</a> ⇒ <code>string</code> | <code>null</code></dt>
<dd><p>Mengambil alamat server proxy dari pengaturan Internet di Windows.</p>
</dd>
<dt><a href="#createStore">createStore(filename)</a> ⇒ <code>Object</code></dt>
<dd><p>Membuat dan mengembalikan objek penyimpanan yang terhubung dengan file.</p>
</dd>
<dt><a href="#fetch">fetch(resource, [options])</a> ⇒ <code><a href="#Response">Promise.&lt;Response&gt;</a></code></dt>
<dd><p>Melakukan permintaan HTTP dan mengembalikan responsnya sebagai Promise.</p>
</dd>
<dt><a href="#read">read(filename, [data])</a> ⇒ <code>Object</code> | <code>string</code></dt>
<dd><p>Membaca data dari file dan mengembalikannya.
Jika file tidak ada, akan membuat file baru dengan data awal yang diberikan.</p>
</dd>
<dt><a href="#write">write(filename, data)</a></dt>
<dd><p>Menyimpan data ke dalam file.
Jika direktori untuk file tidak ada, akan membuat direktori tersebut secara rekursif.</p>
</dd>
<dt><a href="#encode">encode(header, payload, secret)</a> ⇒ <code>string</code></dt>
<dd><p>Mengkodekan header dan payload menjadi token JWT menggunakan algoritma penandatanganan yang ditentukan.</p>
</dd>
<dt><a href="#decode">decode(token, secret)</a> ⇒ <code>Object</code> | <code>null</code></dt>
<dd><p>Menguraikan token JWT dan memverifikasi tanda tangan menggunakan kunci rahasia.</p>
</dd>
<dt><a href="#compression">compression()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk kompresi respons berdasarkan header &#39;Accept-Encoding&#39;.</p>
</dd>
<dt><a href="#messages">messages()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk mem-parsing body permintaan pada metode POST, PATCH, dan PUT.</p>
</dd>
<dt><a href="#cookies">cookies()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk mengelola cookie dalam permintaan dan respons.</p>
</dd>
<dt><a href="#security">security()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menambahkan header keamanan pada respons.</p>
</dd>
<dt><a href="#cors">cors()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menangani permintaan CORS.</p>
</dd>
<dt><a href="#authorization">authorization()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk mengelola otorisasi akses berdasarkan IP dan token.</p>
</dd>
<dt><a href="#fallback">fallback()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk mengembalikan respons 404 jika tidak ditemukan.</p>
</dd>
<dt><a href="#catchAll">catchAll(err, req, res, next)</a></dt>
<dd><p>Middleware untuk menangani kesalahan.</p>
</dd>
<dt><a href="#hotp">hotp(options)</a> ⇒ <code>string</code></dt>
<dd><p>Menghitung One-Time Password (OTP) berdasarkan HMAC-based One-Time Password (HOTP) 
menggunakan parameter yang diberikan.</p>
</dd>
<dt><a href="#totp">totp(options)</a> ⇒ <code>string</code></dt>
<dd><p>Menghitung One-Time Password (OTP) berdasarkan Time-based One-Time Password (TOTP)
menggunakan parameter yang diberikan.</p>
</dd>
<dt><a href="#checkValidity">checkValidity(data, options)</a></dt>
<dd><p>Memeriksa validitas data berdasarkan opsi validasi yang diberikan.</p>
</dd>
</dl>

<a name="CookieStore"></a>

## CookieStore
Kelas untuk mengelola penyimpanan cookie sebagai objek.

**Kind**: global class  

* [CookieStore](#CookieStore)
    * [new CookieStore([init])](#new_CookieStore_new)
    * [.cookie](#CookieStore+cookie) ⇒ <code>string</code>
    * [.cookie](#CookieStore+cookie)
    * [.delete(name)](#CookieStore+delete)
    * [.get(name)](#CookieStore+get) ⇒ <code>Object</code>
    * [.getAll(name)](#CookieStore+getAll) ⇒ <code>Array</code>
    * [.set(name, value)](#CookieStore+set)

<a name="new_CookieStore_new"></a>

### new CookieStore([init])
Konstruktor untuk membuat instance `CookieStore` dengan inisialisasi data.


| Param | Type | Description |
| --- | --- | --- |
| [init] | <code>Object</code> | Objek inisialisasi yang berisi nama cookie dan opsinya. |

<a name="CookieStore+cookie"></a>

### cookieStore.cookie ⇒ <code>string</code>
Mengambil semua cookie yang disimpan dalam format string yang sesuai dengan format HTTP.

**Kind**: instance property of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>string</code> - Daftar cookie dalam format "key=value", dipisahkan dengan "; ".  
<a name="CookieStore+cookie"></a>

### cookieStore.cookie
Menyimpan cookie dari string atau array yang sesuai dengan format HTTP.

**Kind**: instance property of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Nilai string atau array yang berisi cookie dalam format "key=value". |

<a name="CookieStore+delete"></a>

### cookieStore.delete(name)
Menghapus cookie berdasarkan nama.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama cookie yang akan dihapus. |

<a name="CookieStore+get"></a>

### cookieStore.get(name) ⇒ <code>Object</code>
Mengambil nilai cookie berdasarkan nama.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>Object</code> - Objek cookie yang ditemukan atau undefined jika tidak ada.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama cookie yang akan diambil. |

<a name="CookieStore+getAll"></a>

### cookieStore.getAll(name) ⇒ <code>Array</code>
Mengambil semua nilai cookie yang cocok dengan nama tertentu.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>Array</code> - Array nilai cookie yang cocok.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama cookie yang akan diambil. |

<a name="CookieStore+set"></a>

### cookieStore.set(name, value)
Menyimpan cookie dengan nama dan nilai yang diberikan.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama cookie. |
| value | <code>string</code> | Nilai cookie. |

<a name="Headers"></a>

## Headers
Kelas untuk mengelola header HTTP sebagai objek.

**Kind**: global class  

* [Headers](#Headers)
    * [new Headers([init])](#new_Headers_new)
    * [.append(name, value)](#Headers+append)
    * [.delete(name)](#Headers+delete)
    * [.entries()](#Headers+entries) ⇒ <code>IterableIterator</code>
    * [.forEach(callbackFn)](#Headers+forEach)
    * [.get(name)](#Headers+get) ⇒ <code>string</code> \| <code>null</code>
    * [.getSetCookie()](#Headers+getSetCookie) ⇒ <code>Array</code>
    * [.has(name)](#Headers+has) ⇒ <code>boolean</code>
    * [.keys()](#Headers+keys) ⇒ <code>IterableIterator</code>
    * [.set(name, value)](#Headers+set)
    * [.values()](#Headers+values) ⇒ <code>IterableIterator</code>

<a name="new_Headers_new"></a>

### new Headers([init])
Konstruktor untuk membuat instance `Headers`.


| Param | Type | Description |
| --- | --- | --- |
| [init] | <code>Object</code> \| <code>Array</code> | Inisialisasi header, bisa berupa objek atau array. |

<a name="Headers+append"></a>

### headers.append(name, value)
Menambahkan nilai baru ke header yang sudah ada, atau membuat header baru jika belum ada.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header. |
| value | <code>string</code> | Nilai header. |

<a name="Headers+delete"></a>

### headers.delete(name)
Menghapus header berdasarkan nama.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header yang akan dihapus. |

<a name="Headers+entries"></a>

### headers.entries() ⇒ <code>IterableIterator</code>
Mengembalikan iterator untuk pasangan nama dan nilai dari header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>IterableIterator</code> - Iterator untuk entri header.  
<a name="Headers+forEach"></a>

### headers.forEach(callbackFn)
Menjalankan fungsi callback untuk setiap header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| callbackFn | <code>function</code> | Fungsi callback yang menerima nilai, nama, dan objek headers. |

<a name="Headers+get"></a>

### headers.get(name) ⇒ <code>string</code> \| <code>null</code>
Mengambil nilai dari header berdasarkan nama.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>string</code> \| <code>null</code> - Nilai header atau null jika tidak ada.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header yang akan diambil. |

<a name="Headers+getSetCookie"></a>

### headers.getSetCookie() ⇒ <code>Array</code>
Mengambil semua nilai dari header "Set-Cookie".

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>Array</code> - Array nilai cookie yang diatur dalam header.  
<a name="Headers+has"></a>

### headers.has(name) ⇒ <code>boolean</code>
Memeriksa apakah header dengan nama tertentu ada.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>boolean</code> - True jika header ada, false jika tidak.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header yang akan diperiksa. |

<a name="Headers+keys"></a>

### headers.keys() ⇒ <code>IterableIterator</code>
Mengembalikan iterator untuk nama-nama header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>IterableIterator</code> - Iterator untuk nama header.  
<a name="Headers+set"></a>

### headers.set(name, value)
Mengatur atau mengganti nilai dari header berdasarkan nama.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header. |
| value | <code>string</code> | Nilai header. |

<a name="Headers+values"></a>

### headers.values() ⇒ <code>IterableIterator</code>
Mengembalikan iterator untuk nilai-nilai dari header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>IterableIterator</code> - Iterator untuk nilai header.  
<a name="ObjectObserver"></a>

## ObjectObserver
Kelas untuk mengawasi perubahan pada objek dan menjalankan callback saat terjadi perubahan.

**Kind**: global class  

* [ObjectObserver](#ObjectObserver)
    * [new ObjectObserver([target], [callback])](#new_ObjectObserver_new)
    * [.get(target, property)](#ObjectObserver+get) ⇒ <code>\*</code>
    * [.set(target, property, value)](#ObjectObserver+set) ⇒ <code>boolean</code>
    * [.deleteProperty(target, property)](#ObjectObserver+deleteProperty) ⇒ <code>boolean</code>

<a name="new_ObjectObserver_new"></a>

### new ObjectObserver([target], [callback])
Konstruktor untuk membuat instance `ObjectObserver`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [target] | <code>Object</code> | <code>{}</code> | Objek yang akan diawasi. |
| [callback] | <code>function</code> | <code>() &#x3D;&gt; {}</code> | Fungsi callback yang akan dipanggil saat perubahan terjadi. |

<a name="ObjectObserver+get"></a>

### objectObserver.get(target, property) ⇒ <code>\*</code>
Mendapatkan nilai properti dari objek yang diawasi.

**Kind**: instance method of [<code>ObjectObserver</code>](#ObjectObserver)  
**Returns**: <code>\*</code> - Nilai dari properti yang diambil.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Objek yang diawasi. |
| property | <code>string</code> | Nama properti yang ingin diambil. |

<a name="ObjectObserver+set"></a>

### objectObserver.set(target, property, value) ⇒ <code>boolean</code>
Mengatur nilai properti dari objek yang diawasi.

**Kind**: instance method of [<code>ObjectObserver</code>](#ObjectObserver)  
**Returns**: <code>boolean</code> - True jika pengaturan berhasil.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Objek yang diawasi. |
| property | <code>string</code> | Nama properti yang akan diatur. |
| value | <code>\*</code> | Nilai baru untuk properti tersebut. |

<a name="ObjectObserver+deleteProperty"></a>

### objectObserver.deleteProperty(target, property) ⇒ <code>boolean</code>
Menghapus properti dari objek yang diawasi.

**Kind**: instance method of [<code>ObjectObserver</code>](#ObjectObserver)  
**Returns**: <code>boolean</code> - True jika penghapusan berhasil.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Objek yang diawasi. |
| property | <code>string</code> | Nama properti yang akan dihapus. |

<a name="Request"></a>

## Request
Kelas untuk membuat dan mengelola permintaan HTTP/HTTPS.

**Kind**: global class  
<a name="new_Request_new"></a>

### new Request(input, [options])
Konstruktor untuk membuat instance `Request`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> |  | URL untuk permintaan. |
| [options] | <code>Object</code> | <code>{}</code> | Opsi untuk permintaan. |
| [options.body] | <code>string</code> \| <code>Readable</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Isi dari permintaan. |
| [options.credentials] | <code>string</code> | <code>&quot;\&quot;same-origin\&quot;&quot;</code> | Kredensial untuk permintaan (default: "same-origin"). |
| [options.headers] | <code>Object</code> | <code>{}</code> | Header untuk permintaan. |
| [options.method] | <code>string</code> | <code>&quot;\&quot;GET\&quot;&quot;</code> | Metode HTTP yang digunakan (default: "GET"). |
| [options.redirect] | <code>string</code> | <code>&quot;\&quot;follow\&quot;&quot;</code> | Kebijakan pengalihan (default: "follow"). |
| [options.follow] | <code>number</code> | <code>30</code> | Jumlah pengalihan yang diizinkan (default: 30). |
| [options.agent] | <code>Object</code> |  | Agen untuk permintaan. |
| [options.insecureHTTPParser] | <code>boolean</code> | <code>true</code> | Parser HTTP yang tidak aman (default: true). |
| [options.signal] | <code>AbortSignal</code> |  | Sinyal untuk membatalkan permintaan. |
| [options.timeout] | <code>number</code> | <code>30000</code> | Batas waktu permintaan dalam milidetik (default: 30 detik). |

<a name="Response"></a>

## Response
Kelas untuk menangani respons dari permintaan HTTP/HTTPS.

**Kind**: global class  

* [Response](#Response)
    * [new Response(body, [options])](#new_Response_new)
    * [.buffer()](#Response+buffer) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.json()](#Response+json) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.text()](#Response+text) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_Response_new"></a>

### new Response(body, [options])
Konstruktor untuk membuat instance `Response`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| body | <code>ReadableStream</code> \| <code>string</code> |  | Isi dari respons. |
| [options] | <code>Object</code> | <code>{}</code> | Opsi untuk respons. |
| [options.status] | <code>number</code> |  | Kode status HTTP dari respons. |
| [options.statusText] | <code>string</code> |  | Pesan status HTTP dari respons. |
| [options.url] | <code>string</code> |  | URL dari respons. |
| [options.headers] | <code>Object</code> | <code>{}</code> | Header untuk respons. |

<a name="Response+buffer"></a>

### response.buffer() ⇒ <code>Promise.&lt;Buffer&gt;</code>
Mengembalikan isi respons dalam bentuk Buffer.

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - - Isi dari respons sebagai Buffer.  
<a name="Response+json"></a>

### response.json() ⇒ <code>Promise.&lt;Object&gt;</code>
Mengembalikan isi respons dalam bentuk objek JSON.

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Isi dari respons sebagai objek JSON.  
<a name="Response+text"></a>

### response.text() ⇒ <code>Promise.&lt;string&gt;</code>
Mengembalikan isi respons dalam bentuk string.

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - Isi dari respons sebagai string.  
<a name="Router"></a>

## Router
Kelas untuk menangani routing dalam aplikasi HTTP.

**Kind**: global class  

* [Router](#Router)
    * [.add(method, path, ...middlewares)](#Router+add)
    * [.use(...args)](#Router+use)
    * [.post(...args)](#Router+post)
    * [.get(...args)](#Router+get)
    * [.patch(...args)](#Router+patch)
    * [.delete(...args)](#Router+delete)
    * [.put(...args)](#Router+put)
    * [.handleRequest(req, res)](#Router+handleRequest)
    * [.listen(...args)](#Router+listen) ⇒ <code>http.Server</code>

<a name="Router+add"></a>

### router.add(method, path, ...middlewares)
Menambahkan rute baru ke router.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Metode HTTP (GET, POST, dll). |
| path | <code>string</code> | Jalur untuk rute. |
| ...middlewares | <code>function</code> | Middleware yang akan diterapkan pada rute. |

<a name="Router+use"></a>

### router.use(...args)
Menambahkan middleware global untuk semua rute.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>function</code> | Middleware yang akan diterapkan. |

<a name="Router+post"></a>

### router.post(...args)
Menambahkan rute POST.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk rute POST. |

<a name="Router+get"></a>

### router.get(...args)
Menambahkan rute GET.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk rute GET. |

<a name="Router+patch"></a>

### router.patch(...args)
Menambahkan rute PATCH.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk rute PATCH. |

<a name="Router+delete"></a>

### router.delete(...args)
Menambahkan rute DELETE.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk rute DELETE. |

<a name="Router+put"></a>

### router.put(...args)
Menambahkan rute PUT.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk rute PUT. |

<a name="Router+handleRequest"></a>

### router.handleRequest(req, res)
Menangani permintaan HTTP dan menjalankan middleware yang sesuai.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | Objek permintaan dari klien. |
| res | <code>http.ServerResponse</code> | Objek respons untuk dikirim kembali ke klien. |

<a name="Router+listen"></a>

### router.listen(...args) ⇒ <code>http.Server</code>
Memulai server dan mendengarkan permintaan pada port yang ditentukan.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>http.Server</code> - - Instance server.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk mendengarkan server. |

<a name="signer"></a>

## signer : <code>Object</code>
Objek untuk menandatangani data menggunakan berbagai algoritma.

**Kind**: global constant  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hs256 | <code>function</code> | Menandatangani data menggunakan HMAC SHA-256. |
| hs384 | <code>function</code> | Menandatangani data menggunakan HMAC SHA-384. |
| hs512 | <code>function</code> | Menandatangani data menggunakan HMAC SHA-512. |
| rs256 | <code>function</code> | Menandatangani data menggunakan RSA SHA-256. |
| rs384 | <code>function</code> | Menandatangani data menggunakan RSA SHA-384. |
| rs512 | <code>function</code> | Menandatangani data menggunakan RSA SHA-512. |
| es256 | <code>function</code> | Menandatangani data menggunakan ECDSA SHA-256. |
| es384 | <code>function</code> | Menandatangani data menggunakan ECDSA SHA-384. |
| es512 | <code>function</code> | Menandatangani data menggunakan ECDSA SHA-512. |
| ps256 | <code>function</code> | Menandatangani data menggunakan RSA PSS SHA-256. |
| ps384 | <code>function</code> | Menandatangani data menggunakan RSA PSS SHA-384. |
| ps512 | <code>function</code> | Menandatangani data menggunakan RSA PSS SHA-512. |

<a name="verifier"></a>

## verifier : <code>Object</code>
Objek untuk memverifikasi tanda tangan menggunakan berbagai algoritma.

**Kind**: global constant  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hs256 | <code>function</code> | Memverifikasi tanda tangan menggunakan HMAC SHA-256. |
| hs384 | <code>function</code> | Memverifikasi tanda tangan menggunakan HMAC SHA-384. |
| hs512 | <code>function</code> | Memverifikasi tanda tangan menggunakan HMAC SHA-512. |
| rs256 | <code>function</code> | Memverifikasi tanda tangan menggunakan RSA SHA-256. |
| rs384 | <code>function</code> | Memverifikasi tanda tangan menggunakan RSA SHA-384. |
| rs512 | <code>function</code> | Memverifikasi tanda tangan menggunakan RSA SHA-512. |
| es256 | <code>function</code> | Memverifikasi tanda tangan menggunakan ECDSA SHA-256. |
| es384 | <code>function</code> | Memverifikasi tanda tangan menggunakan ECDSA SHA-384. |
| es512 | <code>function</code> | Memverifikasi tanda tangan menggunakan ECDSA SHA-512. |
| ps256 | <code>function</code> | Memverifikasi tanda tangan menggunakan RSA PSS SHA-256. |
| ps384 | <code>function</code> | Memverifikasi tanda tangan menggunakan RSA PSS SHA-384. |
| ps512 | <code>function</code> | Memverifikasi tanda tangan menggunakan RSA PSS SHA-512. |

<a name="Validators"></a>

## Validators
Objek berisi validator untuk memeriksa nilai.

**Kind**: global constant  

* [Validators](#Validators)
    * [.required([message])](#Validators.required) ⇒ <code>function</code>
    * [.minLength(minLength, [message])](#Validators.minLength) ⇒ <code>function</code>
    * [.maxLength(maxLength, [message])](#Validators.maxLength) ⇒ <code>function</code>
    * [.min(min, [message])](#Validators.min) ⇒ <code>function</code>
    * [.max(max, [message])](#Validators.max) ⇒ <code>function</code>
    * [.pattern(pattern, [message])](#Validators.pattern) ⇒ <code>function</code>

<a name="Validators.required"></a>

### Validators.required([message]) ⇒ <code>function</code>
Memeriksa apakah nilai tidak null, undefined, atau string kosong.

**Kind**: static method of [<code>Validators</code>](#Validators)  
**Returns**: <code>function</code> - - Fungsi validasi yang memeriksa nilai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [message] | <code>string</code> | <code>&quot;\&quot;required value\&quot;&quot;</code> | Pesan kesalahan jika validasi gagal. |

<a name="Validators.minLength"></a>

### Validators.minLength(minLength, [message]) ⇒ <code>function</code>
Memeriksa apakah panjang nilai lebih besar dari atau sama dengan minLength.

**Kind**: static method of [<code>Validators</code>](#Validators)  
**Returns**: <code>function</code> - - Fungsi validasi yang memeriksa panjang nilai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| minLength | <code>number</code> |  | Panjang minimum yang diharapkan. |
| [message] | <code>string</code> | <code>&quot;\&quot;invalid min length\&quot;&quot;</code> | Pesan kesalahan jika validasi gagal. |

<a name="Validators.maxLength"></a>

### Validators.maxLength(maxLength, [message]) ⇒ <code>function</code>
Memeriksa apakah panjang nilai lebih kecil dari atau sama dengan maxLength.

**Kind**: static method of [<code>Validators</code>](#Validators)  
**Returns**: <code>function</code> - - Fungsi validasi yang memeriksa panjang nilai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| maxLength | <code>number</code> |  | Panjang maksimum yang diharapkan. |
| [message] | <code>string</code> | <code>&quot;\&quot;invalid max length\&quot;&quot;</code> | Pesan kesalahan jika validasi gagal. |

<a name="Validators.min"></a>

### Validators.min(min, [message]) ⇒ <code>function</code>
Memeriksa apakah nilai lebih besar dari atau sama dengan min.

**Kind**: static method of [<code>Validators</code>](#Validators)  
**Returns**: <code>function</code> - - Fungsi validasi yang memeriksa nilai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> |  | Nilai minimum yang diharapkan. |
| [message] | <code>string</code> | <code>&quot;\&quot;invalid min value\&quot;&quot;</code> | Pesan kesalahan jika validasi gagal. |

<a name="Validators.max"></a>

### Validators.max(max, [message]) ⇒ <code>function</code>
Memeriksa apakah nilai lebih kecil dari atau sama dengan max.

**Kind**: static method of [<code>Validators</code>](#Validators)  
**Returns**: <code>function</code> - - Fungsi validasi yang memeriksa nilai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| max | <code>number</code> |  | Nilai maksimum yang diharapkan. |
| [message] | <code>string</code> | <code>&quot;\&quot;invalid max value\&quot;&quot;</code> | Pesan kesalahan jika validasi gagal. |

<a name="Validators.pattern"></a>

### Validators.pattern(pattern, [message]) ⇒ <code>function</code>
Memeriksa apakah nilai cocok dengan pola regex yang diberikan.

**Kind**: static method of [<code>Validators</code>](#Validators)  
**Returns**: <code>function</code> - - Fungsi validasi yang memeriksa pola nilai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pattern | <code>string</code> |  | Pola regex untuk validasi. |
| [message] | <code>string</code> | <code>&quot;\&quot;invalid pattern\&quot;&quot;</code> | Pesan kesalahan jika validasi gagal. |

<a name="generateRootCA"></a>

## generateRootCA([commonName]) ⇒ <code>Object</code>
Menghasilkan sertifikat Certificate Authority (CA) root.

**Kind**: global function  
**Returns**: <code>Object</code> - Objek yang berisi kunci privat, kunci publik, dan sertifikat dalam format PEM.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [commonName] | <code>string</code> | <code>&quot;\&quot;CertManager\&quot;&quot;</code> | Nama umum untuk sertifikat CA. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Kunci privat CA dalam format PEM. |
| publicKey | <code>string</code> | Kunci publik CA dalam format PEM. |
| certificate | <code>string</code> | Sertifikat CA dalam format PEM. |

<a name="generateCertsForHostname"></a>

## generateCertsForHostname(domain, rootCAConfig) ⇒ <code>Object</code>
Menghasilkan sertifikat untuk hostname yang ditentukan menggunakan konfigurasi CA root.

**Kind**: global function  
**Returns**: <code>Object</code> - Objek yang berisi kunci privat, kunci publik, dan sertifikat dalam format PEM.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | Nama domain untuk sertifikat yang dihasilkan. |
| rootCAConfig | <code>Object</code> | Objek konfigurasi untuk CA root. |
| rootCAConfig.cert | <code>string</code> | Sertifikat CA dalam format PEM. |
| rootCAConfig.key | <code>string</code> | Kunci privat CA dalam format PEM. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Kunci privat sertifikat domain dalam format PEM. |
| publicKey | <code>string</code> | Kunci publik sertifikat domain dalam format PEM. |
| certificate | <code>string</code> | Sertifikat domain dalam format PEM. |

<a name="getProxyServer"></a>

## getProxyServer() ⇒ <code>string</code> \| <code>null</code>
Mengambil alamat server proxy dari pengaturan Internet di Windows.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>null</code> - Alamat server proxy dalam format string jika ditemukan, 
                       atau null jika tidak ada pengaturan proxy.  
<a name="createStore"></a>

## createStore(filename) ⇒ <code>Object</code>
Membuat dan mengembalikan objek penyimpanan yang terhubung dengan file.

**Kind**: global function  
**Returns**: <code>Object</code> - Objek yang mengamati perubahan pada data penyimpanan 
                  dan menulis kembali ke file saat terjadi perubahan.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | Nama file yang digunakan untuk membaca dan menulis data penyimpanan. |

<a name="fetch"></a>

## fetch(resource, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#Response)
Melakukan permintaan HTTP dan mengembalikan responsnya sebagai Promise.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#Response) - Promise yang menyelesaikan respons HTTP setelah permintaan selesai.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> |  | URL sumber daya yang ingin diambil. |
| [options] | <code>Object</code> | <code>{}</code> | Opsi untuk permintaan HTTP. |
| [options.credentials] | <code>string</code> |  | Mengontrol apakah cookie harus disertakan dalam permintaan. |
| [options.store] | <code>Object</code> |  | Objek penyimpanan yang berisi cookie dan data lainnya. |

<a name="read"></a>

## read(filename, [data]) ⇒ <code>Object</code> \| <code>string</code>
Membaca data dari file dan mengembalikannya.
Jika file tidak ada, akan membuat file baru dengan data awal yang diberikan.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>string</code> - Data yang dibaca dari file. 
                        Jika file adalah JSON, maka akan dikembalikan sebagai objek.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | Nama file yang akan dibaca. |
| [data] | <code>Object</code> | <code>{}</code> | Data awal yang akan digunakan jika file tidak ditemukan. |

<a name="write"></a>

## write(filename, data)
Menyimpan data ke dalam file.
Jika direktori untuk file tidak ada, akan membuat direktori tersebut secara rekursif.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | Nama file tempat data akan disimpan. |
| data | <code>Object</code> \| <code>string</code> | Data yang akan disimpan ke file. |

<a name="encode"></a>

## encode(header, payload, secret) ⇒ <code>string</code>
Mengkodekan header dan payload menjadi token JWT menggunakan algoritma penandatanganan yang ditentukan.

**Kind**: global function  
**Returns**: <code>string</code> - Token JWT yang telah dikodekan.  

| Param | Type | Description |
| --- | --- | --- |
| header | <code>Object</code> | Objek header JWT yang berisi informasi algoritma dan tipe token. |
| payload | <code>Object</code> | Objek payload JWT yang berisi informasi yang ingin disimpan dalam token. |
| secret | <code>string</code> | Kunci rahasia yang digunakan untuk menandatangani token. |

<a name="decode"></a>

## decode(token, secret) ⇒ <code>Object</code> \| <code>null</code>
Menguraikan token JWT dan memverifikasi tanda tangan menggunakan kunci rahasia.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>null</code> - Objek payload jika token valid, atau null jika tidak valid.  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | Token JWT yang ingin diuraikan. |
| secret | <code>string</code> | Kunci rahasia yang digunakan untuk memverifikasi token. |

<a name="compression"></a>

## compression() ⇒ <code>function</code>
Middleware untuk kompresi respons berdasarkan header 'Accept-Encoding'.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang melakukan kompresi respons.  
<a name="messages"></a>

## messages() ⇒ <code>function</code>
Middleware untuk mem-parsing body permintaan pada metode POST, PATCH, dan PUT.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang mem-parsing body permintaan.  
<a name="cookies"></a>

## cookies() ⇒ <code>function</code>
Middleware untuk mengelola cookie dalam permintaan dan respons.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang mengelola cookie.  
<a name="security"></a>

## security() ⇒ <code>function</code>
Middleware untuk menambahkan header keamanan pada respons.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang menambahkan header keamanan.  
<a name="cors"></a>

## cors() ⇒ <code>function</code>
Middleware untuk menangani permintaan CORS.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang mengatur header CORS.  
<a name="authorization"></a>

## authorization() ⇒ <code>function</code>
Middleware untuk mengelola otorisasi akses berdasarkan IP dan token.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang mengatur otorisasi.  
<a name="fallback"></a>

## fallback() ⇒ <code>function</code>
Middleware untuk mengembalikan respons 404 jika tidak ditemukan.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware yang mengatur respons 404.  
<a name="catchAll"></a>

## catchAll(err, req, res, next)
Middleware untuk menangani kesalahan.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | Kesalahan yang ditangkap. |
| req | <code>Object</code> | Objek permintaan. |
| res | <code>Object</code> | Objek respons. |
| next | <code>function</code> | Fungsi untuk melanjutkan ke middleware berikutnya. |

<a name="hotp"></a>

## hotp(options) ⇒ <code>string</code>
Menghitung One-Time Password (OTP) berdasarkan HMAC-based One-Time Password (HOTP) 
menggunakan parameter yang diberikan.

**Kind**: global function  
**Returns**: <code>string</code> - OTP yang dihasilkan.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Opsi untuk menghasilkan OTP. |
| options.secret | <code>string</code> |  | Kunci rahasia yang digunakan untuk menghasilkan OTP. |
| options.count | <code>number</code> |  | Hitungan yang digunakan untuk menghitung OTP. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | Algoritma hashing yang digunakan (default: "sha1"). |
| [options.digits] | <code>number</code> | <code>6</code> | Jumlah digit dalam OTP (default: 6). |

<a name="totp"></a>

## totp(options) ⇒ <code>string</code>
Menghitung One-Time Password (OTP) berdasarkan Time-based One-Time Password (TOTP)
menggunakan parameter yang diberikan.

**Kind**: global function  
**Returns**: <code>string</code> - OTP yang dihasilkan.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Opsi untuk menghasilkan OTP. |
| options.secret | <code>string</code> |  | Kunci rahasia yang digunakan untuk menghasilkan OTP. |
| [options.T] | <code>number</code> | <code>Math.floor(Date.now() / 1000)</code> | Waktu saat ini dalam detik (default: waktu sekarang). |
| [options.T0] | <code>number</code> | <code>0</code> | Waktu awal dalam detik (default: 0). |
| [options.X] | <code>number</code> | <code>30</code> | Interval waktu dalam detik (default: 30). |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | Algoritma hashing yang digunakan (default: "sha1"). |
| [options.digits] | <code>number</code> | <code>6</code> | Jumlah digit dalam OTP (default: 6). |

<a name="checkValidity"></a>

## checkValidity(data, options)
Memeriksa validitas data berdasarkan opsi validasi yang diberikan.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Membuang kesalahan jika salah satu validasi gagal.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Objek data yang akan divalidasi. |
| options | <code>Object</code> | Opsi validasi yang berisi nama dan metode validasi. |

