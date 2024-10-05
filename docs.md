## Classes

<dl>
<dt><a href="#CookieStore">CookieStore</a></dt>
<dd><p>Kelas CookieStore untuk mengelola cookie.</p>
<p>Kelas ini menyediakan metode untuk mengatur, mendapatkan, dan menghapus cookie
dari objek ini. Selain itu, cookie dapat diatur dan diambil dalam bentuk
string yang sesuai dengan format cookie HTTP.</p>
</dd>
<dt><a href="#Headers">Headers</a></dt>
<dd><p>Kelas untuk mengelola header HTTP dengan metode untuk menambah, menghapus, dan mengambil nilai header.</p>
</dd>
<dt><a href="#ObjectObserver">ObjectObserver</a></dt>
<dd><p>Kelas ObjectObserver digunakan untuk mengamati perubahan pada objek JavaScript.</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd><p>Kelas yang merepresentasikan sebuah permintaan HTTP.</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>Kelas yang merepresentasikan sebuah respons HTTP.</p>
</dd>
<dt><a href="#Router">Router</a></dt>
<dd><p>Kelas Router untuk menangani routing HTTP dengan middleware.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getExtensionSAN">getExtensionSAN([domain])</a> ⇒ <code>Object</code></dt>
<dd><p>Mendapatkan ekstensi Subject Alternative Name (SAN) untuk domain atau IP.</p>
</dd>
<dt><a href="#getKeysAndCert">getKeysAndCert([serialNumber])</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan pasangan kunci dan sertifikat.</p>
</dd>
<dt><a href="#generateRootCA">generateRootCA([commonName])</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan Root Certificate Authority (CA).</p>
</dd>
<dt><a href="#generateCertsForHostname">generateCertsForHostname(domain, rootCAConfig)</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan sertifikat untuk hostname berdasarkan Root CA.</p>
</dd>
<dt><a href="#setDefaultAttrs">setDefaultAttrs(attrs)</a></dt>
<dd><p>Mengubah atribut default yang digunakan dalam pembuatan sertifikat.</p>
</dd>
<dt><a href="#normalizeCookie">normalizeCookie(name, [value])</a> ⇒ <code>Object</code></dt>
<dd><p>Mengnormalize cookie menjadi objek dengan properti &#39;name&#39; dan &#39;value&#39;.</p>
<p>Jika parameter &#39;name&#39; bukan objek, fungsi ini akan mengonversi
menjadi objek dengan properti &#39;name&#39; dan &#39;value&#39;.</p>
</dd>
<dt><a href="#createStore">createStore(filename)</a> ⇒ <code>Proxy</code></dt>
<dd><p>Membuat store yang terhubung dengan file JSON untuk menyimpan dan mengelola data.</p>
</dd>
<dt><a href="#fetch">fetch(resource, [options])</a> ⇒ <code><a href="#Response">Promise.&lt;Response&gt;</a></code></dt>
<dd><p>Melakukan permintaan HTTP dan mengembalikan respons.</p>
</dd>
<dt><a href="#normalizeHeaders">normalizeHeaders(name)</a> ⇒ <code>string</code></dt>
<dd><p>Menormalkan nama header HTTP ke format standar.</p>
</dd>
<dt><a href="#encode">encode(header, payload, secret)</a> ⇒ <code>string</code></dt>
<dd><p>Mengenkode header dan payload menjadi token JWT.</p>
</dd>
<dt><a href="#decode">decode(token, secret)</a> ⇒ <code>Object</code> | <code>null</code></dt>
<dd><p>Mendekode token JWT dan memverifikasi tanda tangan.</p>
</dd>
<dt><a href="#compression">compression()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk melakukan kompresi pada respon HTTP berdasarkan <code>Accept-Encoding</code> dari header request.</p>
<p>Mendukung kompresi Brotli (<code>br</code>), Gzip (<code>gzip</code>), dan Deflate (<code>deflate</code>).
Secara otomatis memilih metode kompresi yang sesuai berdasarkan preferensi client yang ada di header <code>accept-encoding</code>.</p>
</dd>
<dt><a href="#messages">messages()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menangani parsing body request berdasarkan metode HTTP dan <code>Content-Type</code>.</p>
<p>Middleware ini memproses body request untuk metode <code>POST</code>, <code>PATCH</code>, dan <code>PUT</code>.
Jika <code>Content-Type</code> adalah <code>application/json</code>, maka body akan diparsing sebagai JSON.
Jika <code>Content-Type</code> adalah <code>application/x-www-form-urlencoded</code>, maka body akan diparsing menjadi objek form data.</p>
</dd>
<dt><a href="#cookies">cookies()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menangani parsing cookie dari header request dan memungkinkan pengaturan cookie di response.</p>
<ul>
<li>Pada request: Cookie yang terdapat di header <code>cookie</code> akan diparsing dan disimpan di <code>req.cookies</code> sebagai objek.</li>
<li>Pada response: Cookie dapat disetel dengan fungsi <code>res.cookie</code>, yang menerima nama, nilai, dan atribut cookie.</li>
</ul>
<p>Atribut cookie yang didukung: <code>domain</code>, <code>expires</code>, <code>httpOnly</code>, <code>maxAge</code>, <code>partitioned</code>, <code>path</code>, <code>secure</code>, <code>sameSite</code>.</p>
</dd>
<dt><a href="#security">security()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menambahkan header keamanan pada respon HTTP.</p>
<p>Header yang ditambahkan:</p>
<ul>
<li><code>X-Content-Type-Options</code>: Menghindari penentuan jenis MIME oleh browser (nosniff).</li>
<li><code>X-Frame-Options</code>: Mencegah embedding dalam iframe (DENY).</li>
<li><code>Strict-Transport-Security</code>: Menerapkan HTTPS pada semua permintaan dengan <code>max-age</code> 2 tahun dan include subdomains (preload).</li>
<li><code>X-XSS-Protection</code>: Mengaktifkan perlindungan XSS di browser.</li>
<li><code>Content-Security-Policy</code>: Mengatur kebijakan sumber konten agar hanya dari domain sendiri (default-src &#39;self&#39;).</li>
<li><code>Referrer-Policy</code>: Mencegah pengiriman informasi referrer (no-referrer).</li>
</ul>
</dd>
<dt><a href="#cors">cors()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menangani Cross-Origin Resource Sharing (CORS).</p>
<p>Middleware ini menambahkan header yang memungkinkan permintaan lintas asal
(cross-origin) untuk diizinkan dari semua sumber. Header yang ditambahkan meliputi:</p>
<ul>
<li><code>Access-Control-Allow-Origin</code>: Mengizinkan semua asal (<code>*</code>).</li>
<li><code>Access-Control-Allow-Methods</code>: Mengizinkan metode HTTP: GET, POST, PUT, DELETE, OPTIONS.</li>
<li><code>Access-Control-Allow-Headers</code>: Mengizinkan header yang digunakan: Content-Type, Authorization.</li>
<li><code>Access-Control-Allow-Credentials</code>: Mengizinkan pengiriman kredensial (true).</li>
</ul>
</dd>
<dt><a href="#authorization">authorization()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menangani otorisasi berdasarkan izin akses.</p>
<p>Middleware ini memeriksa apakah pengguna memiliki izin untuk mengakses
endpoint tertentu berdasarkan alamat IP, metode HTTP, dan token otorisasi.</p>
<p>Izin akses diatur dalam bentuk pola regex untuk alamat IP dan path.</p>
</dd>
<dt><a href="#fallback">fallback()</a> ⇒ <code>function</code></dt>
<dd><p>Middleware untuk menangani permintaan yang tidak ditemukan (404).</p>
<p>Middleware ini mengatur respons dengan status 404 dan mengembalikan
pesan &quot;Tidak ditemukan&quot; ketika rute yang diminta tidak ada.</p>
</dd>
<dt><a href="#catchAll">catchAll(err, req, res, next)</a> ⇒ <code>void</code></dt>
<dd><p>Middleware untuk menangani semua kesalahan yang tidak tertangani.</p>
<p>Middleware ini mengubah status kode respons menjadi 500 jika status kode
saat ini berada dalam rentang 200 hingga 299. Kemudian, ia mengembalikan
pesan kesalahan dalam format JSON.</p>
</dd>
<dt><a href="#hotp">hotp(options)</a> ⇒ <code>string</code></dt>
<dd><p>Menghitung nilai HOTP (HMAC-based One-Time Password).</p>
</dd>
<dt><a href="#totp">totp(options)</a> ⇒ <code>string</code></dt>
<dd><p>Menghitung nilai TOTP (Time-based One-Time Password).</p>
</dd>
<dt><a href="#checkValidity">checkValidity(data, options)</a></dt>
<dd><p>Memeriksa validitas data menggunakan validator yang ditentukan dalam opsi.</p>
</dd>
</dl>

<a name="CookieStore"></a>

## CookieStore
Kelas CookieStore untuk mengelola cookie.

Kelas ini menyediakan metode untuk mengatur, mendapatkan, dan menghapus cookie
dari objek ini. Selain itu, cookie dapat diatur dan diambil dalam bentuk
string yang sesuai dengan format cookie HTTP.

**Kind**: global class  

* [CookieStore](#CookieStore)
    * [new CookieStore(init)](#new_CookieStore_new)
    * [.cookie](#CookieStore+cookie) ⇒ <code>string</code>
    * [.cookie](#CookieStore+cookie)
    * [.delete(name)](#CookieStore+delete)
    * [.get(name)](#CookieStore+get) ⇒ <code>string</code> \| <code>undefined</code>
    * [.getAll(name)](#CookieStore+getAll) ⇒ <code>Array</code>
    * [.set(name, value)](#CookieStore+set)

<a name="new_CookieStore_new"></a>

### new CookieStore(init)
Konstruktor untuk menginisialisasi CookieStore dengan cookie.


| Param | Type | Description |
| --- | --- | --- |
| init | <code>Object</code> | Objek yang berisi cookie yang ingin diatur. |

<a name="CookieStore+cookie"></a>

### cookieStore.cookie ⇒ <code>string</code>
Mengambil semua cookie dalam format string.

**Kind**: instance property of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>string</code> - - String yang berisi semua cookie yang dipisahkan oleh '; '.  
<a name="CookieStore+cookie"></a>

### cookieStore.cookie
Mengatur cookie dari string atau array string.

**Kind**: instance property of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>Array.&lt;string&gt;</code> | String atau array string yang berisi cookie. |

<a name="CookieStore+delete"></a>

### cookieStore.delete(name)
Menghapus cookie berdasarkan nama.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object</code> | Nama cookie yang ingin dihapus. |

<a name="CookieStore+get"></a>

### cookieStore.get(name) ⇒ <code>string</code> \| <code>undefined</code>
Mendapatkan nilai cookie berdasarkan nama.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>string</code> \| <code>undefined</code> - - Nilai cookie atau undefined jika tidak ditemukan.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object</code> | Nama cookie yang ingin diambil. |

<a name="CookieStore+getAll"></a>

### cookieStore.getAll(name) ⇒ <code>Array</code>
Mendapatkan semua nilai cookie dengan nama yang sama.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>Array</code> - - Array yang berisi semua nilai cookie yang ditemukan.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object</code> | Nama cookie yang ingin diambil. |

<a name="CookieStore+set"></a>

### cookieStore.set(name, value)
Mengatur cookie dengan nama dan nilai.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object</code> | Nama cookie. |
| value | <code>string</code> | Nilai cookie. |

<a name="Headers"></a>

## Headers
Kelas untuk mengelola header HTTP dengan metode untuk menambah, menghapus, dan mengambil nilai header.

**Kind**: global class  

* [Headers](#Headers)
    * [new Headers(init)](#new_Headers_new)
    * [.append(name, value)](#Headers+append)
    * [.delete(name)](#Headers+delete)
    * [.entries()](#Headers+entries) ⇒ <code>IterableIterator</code>
    * [.forEach(callbackFn)](#Headers+forEach)
    * [.get(name)](#Headers+get) ⇒ <code>string</code> \| <code>null</code>
    * [.getSetCookie()](#Headers+getSetCookie) ⇒ <code>Array.&lt;string&gt;</code>
    * [.has(name)](#Headers+has) ⇒ <code>boolean</code>
    * [.keys()](#Headers+keys) ⇒ <code>IterableIterator</code>
    * [.set(name, value)](#Headers+set)
    * [.values()](#Headers+values) ⇒ <code>IterableIterator</code>

<a name="new_Headers_new"></a>

### new Headers(init)
Membuat instance Headers dengan nilai awal.


| Param | Type | Description |
| --- | --- | --- |
| init | <code>object</code> \| <code>Array</code> | Objek atau array pasangan kunci-nilai untuk menginisialisasi header. |

<a name="Headers+append"></a>

### headers.append(name, value)
Menambahkan nilai ke header dengan nama yang diberikan.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header. |
| value | <code>string</code> | Nilai yang akan ditambahkan ke header. |

<a name="Headers+delete"></a>

### headers.delete(name)
Menghapus header dengan nama yang diberikan.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header yang akan dihapus. |

<a name="Headers+entries"></a>

### headers.entries() ⇒ <code>IterableIterator</code>
Mengembalikan iterator untuk entri header (nama dan nilai).

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>IterableIterator</code> - - Iterator untuk entri header.  
<a name="Headers+forEach"></a>

### headers.forEach(callbackFn)
Menjalankan fungsi callback untuk setiap entri header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| callbackFn | <code>function</code> | Fungsi callback yang akan dijalankan untuk setiap entri. |

<a name="Headers+get"></a>

### headers.get(name) ⇒ <code>string</code> \| <code>null</code>
Mengambil nilai header dengan nama yang diberikan.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>string</code> \| <code>null</code> - - Nilai header, atau null jika header tidak ada.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header yang akan diambil nilainya. |

<a name="Headers+getSetCookie"></a>

### headers.getSetCookie() ⇒ <code>Array.&lt;string&gt;</code>
Mengambil semua nilai header "Set-Cookie".

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>Array.&lt;string&gt;</code> - - Array yang berisi nilai-nilai dari header "Set-Cookie".  
<a name="Headers+has"></a>

### headers.has(name) ⇒ <code>boolean</code>
Memeriksa apakah header dengan nama tertentu ada.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>boolean</code> - - True jika header ada, sebaliknya false.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header yang akan diperiksa. |

<a name="Headers+keys"></a>

### headers.keys() ⇒ <code>IterableIterator</code>
Mengembalikan iterator untuk kunci header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>IterableIterator</code> - - Iterator untuk kunci header.  
<a name="Headers+set"></a>

### headers.set(name, value)
Mengatur nilai untuk header dengan nama yang diberikan.

**Kind**: instance method of [<code>Headers</code>](#Headers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header. |
| value | <code>string</code> | Nilai yang akan diatur untuk header. |

<a name="Headers+values"></a>

### headers.values() ⇒ <code>IterableIterator</code>
Mengembalikan iterator untuk nilai header.

**Kind**: instance method of [<code>Headers</code>](#Headers)  
**Returns**: <code>IterableIterator</code> - - Iterator untuk nilai header.  
<a name="ObjectObserver"></a>

## ObjectObserver
Kelas ObjectObserver digunakan untuk mengamati perubahan pada objek JavaScript.

**Kind**: global class  

* [ObjectObserver](#ObjectObserver)
    * [new ObjectObserver([target], [callback])](#new_ObjectObserver_new)
    * [.get(target, property)](#ObjectObserver+get) ⇒ <code>any</code>
    * [.set(target, property, value)](#ObjectObserver+set) ⇒ <code>boolean</code>
    * [.deleteProperty(target, property)](#ObjectObserver+deleteProperty) ⇒ <code>boolean</code>

<a name="new_ObjectObserver_new"></a>

### new ObjectObserver([target], [callback])
Membuat instance ObjectObserver.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [target] | <code>Object</code> | <code>{}</code> | Objek yang ingin diamati. |
| [callback] | <code>function</code> | <code>() &#x3D;&gt; {}</code> | Fungsi callback yang dipanggil saat terjadi perubahan. |

<a name="ObjectObserver+get"></a>

### objectObserver.get(target, property) ⇒ <code>any</code>
Metode ini dipanggil saat properti dari objek diakses.

**Kind**: instance method of [<code>ObjectObserver</code>](#ObjectObserver)  
**Returns**: <code>any</code> - - Nilai dari properti yang diakses.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Objek yang sedang diamati. |
| property | <code>string</code> | Nama properti yang diakses. |

<a name="ObjectObserver+set"></a>

### objectObserver.set(target, property, value) ⇒ <code>boolean</code>
Metode ini dipanggil saat properti diubah.

**Kind**: instance method of [<code>ObjectObserver</code>](#ObjectObserver)  
**Returns**: <code>boolean</code> - - Mengembalikan true jika operasi berhasil.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Objek yang sedang diamati. |
| property | <code>string</code> | Nama properti yang diubah. |
| value | <code>any</code> | Nilai baru untuk properti tersebut. |

<a name="ObjectObserver+deleteProperty"></a>

### objectObserver.deleteProperty(target, property) ⇒ <code>boolean</code>
Metode ini dipanggil saat properti dihapus.

**Kind**: instance method of [<code>ObjectObserver</code>](#ObjectObserver)  
**Returns**: <code>boolean</code> - - Mengembalikan true jika operasi berhasil.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Objek yang sedang diamati. |
| property | <code>string</code> | Nama properti yang dihapus. |

<a name="Request"></a>

## Request
Kelas yang merepresentasikan sebuah permintaan HTTP.

**Kind**: global class  
<a name="new_Request_new"></a>

### new Request(input, [options])
Membuat instance Request dengan input URL dan opsi yang diberikan.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> |  | URL permintaan. |
| [options] | <code>object</code> | <code>{}</code> | Opsi tambahan untuk permintaan. |
| [options.body] | <code>string</code> \| <code>ReadableStream</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Isi dari permintaan. |
| [options.credentials] | <code>string</code> | <code>&quot;\&quot;same-origin\&quot;&quot;</code> | Kredensial yang digunakan untuk permintaan. |
| [options.headers] | [<code>Headers</code>](#Headers) | <code>{}</code> | Header yang akan ditambahkan ke permintaan. |
| [options.method] | <code>string</code> | <code>&quot;\&quot;GET\&quot;&quot;</code> | Metode HTTP yang digunakan (GET, POST, dll). |
| [options.redirect] | <code>string</code> | <code>&quot;\&quot;follow\&quot;&quot;</code> | Kebijakan pengalihan. |
| [options.follow] | <code>number</code> | <code>30</code> | Jumlah maksimum pengalihan. |
| [options.agent] | <code>Agent</code> |  | Agent untuk koneksi. |
| [options.insecureHTTPParser] | <code>boolean</code> | <code>true</code> | Mengizinkan parser HTTP yang tidak aman. |
| [options.signal] | <code>AbortSignal</code> |  | Sinyal untuk membatalkan permintaan. |
| [options.timeout] | <code>number</code> | <code>30000</code> | Batas waktu untuk permintaan dalam milidetik. |

<a name="Response"></a>

## Response
Kelas yang merepresentasikan sebuah respons HTTP.

**Kind**: global class  

* [Response](#Response)
    * [new Response(body, [options])](#new_Response_new)
    * [.buffer()](#Response+buffer) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.json()](#Response+json) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.text()](#Response+text) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_Response_new"></a>

### new Response(body, [options])
Membuat instance Response dengan isi dan opsi yang diberikan.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| body | <code>ReadableStream</code> \| <code>Buffer</code> \| <code>string</code> |  | Isi dari respons. |
| [options] | <code>object</code> | <code>{}</code> | Opsi tambahan untuk respons. |
| [options.headers] | [<code>Headers</code>](#Headers) | <code>{}</code> | Header yang akan ditambahkan ke respons. |
| [options.status] | <code>number</code> | <code>200</code> | Kode status HTTP. |
| [options.statusText] | <code>string</code> | <code>&quot;\&quot;OK\&quot;&quot;</code> | Pesan status HTTP. |
| [options.url] | <code>string</code> |  | URL dari respons. |

<a name="Response+buffer"></a>

### response.buffer() ⇒ <code>Promise.&lt;Buffer&gt;</code>
Mengambil isi respons sebagai Buffer.

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - Buffer dari isi respons.  
<a name="Response+json"></a>

### response.json() ⇒ <code>Promise.&lt;object&gt;</code>
Mengambil isi respons sebagai objek JSON.

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Objek JSON yang diambil dari isi respons.  
<a name="Response+text"></a>

### response.text() ⇒ <code>Promise.&lt;string&gt;</code>
Mengambil isi respons sebagai string.

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;string&gt;</code> - String dari isi respons.  
<a name="Router"></a>

## Router
Kelas Router untuk menangani routing HTTP dengan middleware.

**Kind**: global class  

* [Router](#Router)
    * [.add(method, path, ...middlewares)](#Router+add)
    * [.use(...args)](#Router+use)
    * [.post(...args)](#Router+post)
    * [.get(...args)](#Router+get)
    * [.patch(...args)](#Router+patch)
    * [.delete(...args)](#Router+delete)
    * [.put(...args)](#Router+put)
    * [.handleRequest(req, res)](#Router+handleRequest) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.listen(...args)](#Router+listen) ⇒ <code>http.Server</code>

<a name="Router+add"></a>

### router.add(method, path, ...middlewares)
Menambahkan rute baru ke router.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Metode HTTP (GET, POST, dll). |
| path | <code>string</code> | Jalur rute yang ditangani. |
| ...middlewares | <code>function</code> | Middleware yang akan dijalankan untuk rute ini. |

<a name="Router+use"></a>

### router.use(...args)
Menambahkan middleware ke router.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>function</code> | Middleware yang akan dijalankan. |

<a name="Router+post"></a>

### router.post(...args)
Menambahkan rute POST.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk menambahkan rute. |

<a name="Router+get"></a>

### router.get(...args)
Menambahkan rute GET.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk menambahkan rute. |

<a name="Router+patch"></a>

### router.patch(...args)
Menambahkan rute PATCH.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk menambahkan rute. |

<a name="Router+delete"></a>

### router.delete(...args)
Menambahkan rute DELETE.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk menambahkan rute. |

<a name="Router+put"></a>

### router.put(...args)
Menambahkan rute PUT.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk menambahkan rute. |

<a name="Router+handleRequest"></a>

### router.handleRequest(req, res) ⇒ <code>Promise.&lt;void&gt;</code>
Menangani permintaan HTTP.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | Objek permintaan HTTP. |
| res | <code>http.ServerResponse</code> | Objek respons HTTP. |

<a name="Router+listen"></a>

### router.listen(...args) ⇒ <code>http.Server</code>
Menjalankan server pada port yang ditentukan.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>http.Server</code> - - Server HTTP yang berjalan.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Argumen untuk mendengarkan permintaan. |

<a name="getExtensionSAN"></a>

## getExtensionSAN([domain]) ⇒ <code>Object</code>
Mendapatkan ekstensi Subject Alternative Name (SAN) untuk domain atau IP.

**Kind**: global function  
**Returns**: <code>Object</code> - - Ekstensi SAN yang berisi nama alternatif subjek.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [domain] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Domain atau alamat IP. |

<a name="getKeysAndCert"></a>

## getKeysAndCert([serialNumber]) ⇒ <code>Object</code>
Menghasilkan pasangan kunci dan sertifikat.

**Kind**: global function  
**Returns**: <code>Object</code> - - Objek berisi kunci (privateKey dan publicKey) dan sertifikat.  

| Param | Type | Description |
| --- | --- | --- |
| [serialNumber] | <code>string</code> | Nomor seri sertifikat, jika tidak diberikan akan dihasilkan secara acak. |

<a name="generateRootCA"></a>

## generateRootCA([commonName]) ⇒ <code>Object</code>
Menghasilkan Root Certificate Authority (CA).

**Kind**: global function  
**Returns**: <code>Object</code> - - Objek yang berisi privateKey, publicKey, dan sertifikat Root CA.  

| Param | Type | Description |
| --- | --- | --- |
| [commonName] | <code>string</code> | Nama umum untuk sertifikat Root CA. |

<a name="generateCertsForHostname"></a>

## generateCertsForHostname(domain, rootCAConfig) ⇒ <code>Object</code>
Menghasilkan sertifikat untuk hostname berdasarkan Root CA.

**Kind**: global function  
**Returns**: <code>Object</code> - - Objek berisi privateKey, publicKey, dan sertifikat untuk hostname.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | Nama domain atau IP yang akan digunakan dalam sertifikat. |
| rootCAConfig | <code>Object</code> | Konfigurasi Root CA yang berisi sertifikat dan kunci private. |

<a name="setDefaultAttrs"></a>

## setDefaultAttrs(attrs)
Mengubah atribut default yang digunakan dalam pembuatan sertifikat.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| attrs | <code>Array.&lt;Object&gt;</code> | Array objek atribut yang baru. |

<a name="normalizeCookie"></a>

## normalizeCookie(name, [value]) ⇒ <code>Object</code>
Mengnormalize cookie menjadi objek dengan properti 'name' dan 'value'.

Jika parameter 'name' bukan objek, fungsi ini akan mengonversi
menjadi objek dengan properti 'name' dan 'value'.

**Kind**: global function  
**Returns**: <code>Object</code> - - Objek cookie dengan properti 'name' dan 'value'.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object</code> | Nama cookie atau objek cookie. |
| [value] | <code>string</code> | Nilai cookie (jika 'name' adalah string). |

<a name="createStore"></a>

## createStore(filename) ⇒ <code>Proxy</code>
Membuat store yang terhubung dengan file JSON untuk menyimpan dan mengelola data.

**Kind**: global function  
**Returns**: <code>Proxy</code> - - Sebuah proxy untuk mengamati dan mengelola objek store.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | Nama file tempat data akan disimpan dan dibaca. |

<a name="fetch"></a>

## fetch(resource, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#Response)
Melakukan permintaan HTTP dan mengembalikan respons.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#Response) - - Promise yang mengembalikan objek Response.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resource | <code>string</code> \| <code>URL</code> |  | URL atau sumber daya yang akan diambil. |
| [options] | <code>object</code> | <code>{}</code> | Opsi tambahan untuk permintaan. |
| [options.credentials] | <code>string</code> | <code>&quot;\&quot;same-origin\&quot;&quot;</code> | Menentukan apakah kredensial (seperti cookies) harus disertakan. |
| [options.store] | <code>object</code> |  | Objek penyimpanan yang dapat digunakan untuk menyimpan cookies. |
| [options.method] | <code>string</code> | <code>&quot;\&quot;GET\&quot;&quot;</code> | Metode HTTP yang akan digunakan (GET, POST, dll.). |
| [options.follow] | <code>number</code> | <code>30</code> | Jumlah maksimum pengalihan yang diizinkan. |

<a name="normalizeHeaders"></a>

## normalizeHeaders(name) ⇒ <code>string</code>
Menormalkan nama header HTTP ke format standar.

**Kind**: global function  
**Returns**: <code>string</code> - - Nama header yang dinormalkan atau nama asli jika tidak ditemukan.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama header HTTP yang ingin dinormalkan. |

<a name="encode"></a>

## encode(header, payload, secret) ⇒ <code>string</code>
Mengenkode header dan payload menjadi token JWT.

**Kind**: global function  
**Returns**: <code>string</code> - - Token JWT yang telah dienkode.  

| Param | Type | Description |
| --- | --- | --- |
| header | <code>Object</code> | Header JWT yang berisi algoritma dan tipe. |
| payload | <code>Object</code> | Data atau payload yang akan dienkode dalam JWT. |
| secret | <code>string</code> | Kunci rahasia yang digunakan untuk menandatangani token. |

<a name="decode"></a>

## decode(token, secret) ⇒ <code>Object</code> \| <code>null</code>
Mendekode token JWT dan memverifikasi tanda tangan.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>null</code> - - Payload yang telah didekode jika tanda tangan valid, atau null jika tidak valid.  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | Token JWT yang akan didekode. |
| secret | <code>string</code> | Kunci rahasia yang digunakan untuk memverifikasi tanda tangan token. |

<a name="compression"></a>

## compression() ⇒ <code>function</code>
Middleware untuk melakukan kompresi pada respon HTTP berdasarkan `Accept-Encoding` dari header request.

Mendukung kompresi Brotli (`br`), Gzip (`gzip`), dan Deflate (`deflate`).
Secara otomatis memilih metode kompresi yang sesuai berdasarkan preferensi client yang ada di header `accept-encoding`.

**Kind**: global function  
**Returns**: <code>function</code> - - Middleware Express yang menangani kompresi respon.  
<a name="messages"></a>

## messages() ⇒ <code>function</code>
Middleware untuk menangani parsing body request berdasarkan metode HTTP dan `Content-Type`.

Middleware ini memproses body request untuk metode `POST`, `PATCH`, dan `PUT`.
Jika `Content-Type` adalah `application/json`, maka body akan diparsing sebagai JSON.
Jika `Content-Type` adalah `application/x-www-form-urlencoded`, maka body akan diparsing menjadi objek form data.

**Kind**: global function  
**Returns**: <code>function</code> - - Middleware Express yang memproses dan memparsing body request.  
<a name="cookies"></a>

## cookies() ⇒ <code>function</code>
Middleware untuk menangani parsing cookie dari header request dan memungkinkan pengaturan cookie di response.

- Pada request: Cookie yang terdapat di header `cookie` akan diparsing dan disimpan di `req.cookies` sebagai objek.
- Pada response: Cookie dapat disetel dengan fungsi `res.cookie`, yang menerima nama, nilai, dan atribut cookie.

Atribut cookie yang didukung: `domain`, `expires`, `httpOnly`, `maxAge`, `partitioned`, `path`, `secure`, `sameSite`.

**Kind**: global function  
**Returns**: <code>function</code> - - Middleware Express untuk menangani cookie request dan response.  
<a name="security"></a>

## security() ⇒ <code>function</code>
Middleware untuk menambahkan header keamanan pada respon HTTP.

Header yang ditambahkan:
- `X-Content-Type-Options`: Menghindari penentuan jenis MIME oleh browser (nosniff).
- `X-Frame-Options`: Mencegah embedding dalam iframe (DENY).
- `Strict-Transport-Security`: Menerapkan HTTPS pada semua permintaan dengan `max-age` 2 tahun dan include subdomains (preload).
- `X-XSS-Protection`: Mengaktifkan perlindungan XSS di browser.
- `Content-Security-Policy`: Mengatur kebijakan sumber konten agar hanya dari domain sendiri (default-src 'self').
- `Referrer-Policy`: Mencegah pengiriman informasi referrer (no-referrer).

**Kind**: global function  
**Returns**: <code>function</code> - Middleware Express yang menambahkan header keamanan pada response.  
<a name="cors"></a>

## cors() ⇒ <code>function</code>
Middleware untuk menangani Cross-Origin Resource Sharing (CORS).

Middleware ini menambahkan header yang memungkinkan permintaan lintas asal
(cross-origin) untuk diizinkan dari semua sumber. Header yang ditambahkan meliputi:
- `Access-Control-Allow-Origin`: Mengizinkan semua asal (`*`).
- `Access-Control-Allow-Methods`: Mengizinkan metode HTTP: GET, POST, PUT, DELETE, OPTIONS.
- `Access-Control-Allow-Headers`: Mengizinkan header yang digunakan: Content-Type, Authorization.
- `Access-Control-Allow-Credentials`: Mengizinkan pengiriman kredensial (true).

**Kind**: global function  
**Returns**: <code>function</code> - Middleware Express untuk mengizinkan permintaan CORS.  
<a name="authorization"></a>

## authorization() ⇒ <code>function</code>
Middleware untuk menangani otorisasi berdasarkan izin akses.

Middleware ini memeriksa apakah pengguna memiliki izin untuk mengakses
endpoint tertentu berdasarkan alamat IP, metode HTTP, dan token otorisasi.

Izin akses diatur dalam bentuk pola regex untuk alamat IP dan path.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware Express untuk memeriksa otorisasi pengguna.  
<a name="fallback"></a>

## fallback() ⇒ <code>function</code>
Middleware untuk menangani permintaan yang tidak ditemukan (404).

Middleware ini mengatur respons dengan status 404 dan mengembalikan
pesan "Tidak ditemukan" ketika rute yang diminta tidak ada.

**Kind**: global function  
**Returns**: <code>function</code> - Middleware Express untuk menangani permintaan yang tidak ditemukan.  
<a name="catchAll"></a>

## catchAll(err, req, res, next) ⇒ <code>void</code>
Middleware untuk menangani semua kesalahan yang tidak tertangani.

Middleware ini mengubah status kode respons menjadi 500 jika status kode
saat ini berada dalam rentang 200 hingga 299. Kemudian, ia mengembalikan
pesan kesalahan dalam format JSON.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | Objek kesalahan yang dilemparkan. |
| req | <code>Object</code> | Objek permintaan Express. |
| res | <code>Object</code> | Objek respons Express. |
| next | <code>function</code> | Fungsi untuk melanjutkan ke middleware berikutnya. |

<a name="hotp"></a>

## hotp(options) ⇒ <code>string</code>
Menghitung nilai HOTP (HMAC-based One-Time Password).

**Kind**: global function  
**Returns**: <code>string</code> - - Nilai HOTP yang dihasilkan.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Opsi untuk menghasilkan HOTP. |
| options.secret | <code>string</code> |  | Kunci rahasia untuk menghasilkan HOTP. |
| options.count | <code>number</code> |  | Nilai hitungan untuk HOTP (biasanya waktu atau hitungan penggunaan). |
| [options.algorithm] | <code>string</code> | <code>&quot;&#x27;sha1&#x27;&quot;</code> | Algoritma HMAC yang digunakan (default: 'sha1'). |
| [options.digits] | <code>number</code> | <code>6</code> | Jumlah digit untuk hasil HOTP (default: 6). |

<a name="totp"></a>

## totp(options) ⇒ <code>string</code>
Menghitung nilai TOTP (Time-based One-Time Password).

**Kind**: global function  
**Returns**: <code>string</code> - - Nilai TOTP yang dihasilkan.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Opsi untuk menghasilkan TOTP. |
| options.secret | <code>string</code> |  | Kunci rahasia untuk menghasilkan TOTP. |
| [options.T] | <code>number</code> | <code>Date.now()/1000</code> | Waktu saat ini dalam detik (default: waktu sekarang). |
| [options.T0] | <code>number</code> | <code>0</code> | Waktu awal dalam detik (default: 0). |
| [options.X] | <code>number</code> | <code>30</code> | Interval waktu dalam detik (default: 30). |
| [options.algorithm] | <code>string</code> | <code>&quot;&#x27;sha1&#x27;&quot;</code> | Algoritma HMAC yang digunakan (default: 'sha1'). |
| [options.digits] | <code>number</code> | <code>6</code> | Jumlah digit untuk hasil TOTP (default: 6). |

<a name="checkValidity"></a>

## checkValidity(data, options)
Memeriksa validitas data menggunakan validator yang ditentukan dalam opsi.

**Kind**: global function  
**Throws**:

- <code>Error</code> Jika validasi tidak berhasil pada salah satu properti data.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Objek data yang akan divalidasi, berisi pasangan key-value untuk setiap properti yang ingin diperiksa. |
| options | <code>object</code> | Opsi validasi, berisi pasangan key dengan validator yang akan diterapkan ke properti yang bersangkutan. |

