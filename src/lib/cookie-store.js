/**
 * Mengnormalize cookie menjadi objek dengan properti 'name' dan 'value'.
 *
 * Jika parameter 'name' bukan objek, fungsi ini akan mengonversi
 * menjadi objek dengan properti 'name' dan 'value'.
 *
 * @param {string|Object} name - Nama cookie atau objek cookie.
 * @param {string} [value] - Nilai cookie (jika 'name' adalah string).
 * @returns {Object} - Objek cookie dengan properti 'name' dan 'value'.
 */
function normalizeCookie(name, value) {
    let object = name;
    if (typeof name !== "object") {
        object = { name, value };
    }

    return object;
}

const COOKIE_ATTRIBUTES_REGEXP = /^(Domain|Expires|HttpOnly|Max-Age|Partitioned|Path|Secure|SameSite)$/i;

/**
 * Kelas CookieStore untuk mengelola cookie.
 *
 * Kelas ini menyediakan metode untuk mengatur, mendapatkan, dan menghapus cookie
 * dari objek ini. Selain itu, cookie dapat diatur dan diambil dalam bentuk
 * string yang sesuai dengan format cookie HTTP.
 */
class CookieStore {
    /**
     * Mengambil semua cookie dalam format string.
     * @returns {string} - String yang berisi semua cookie yang dipisahkan oleh '; '.
     */
    get cookie() {
        const array = [];

        for (const [, { name, value }] of Object.entries(this)) {
            array.push([name, value].join("="));
        }

        return array.join("; ");
    }

    /**
     * Mengatur cookie dari string atau array string.
     * @param {string|string[]} value - String atau array string yang berisi cookie.
     */
    set cookie(value) {
        let array = value;
        if (!Array.isArray(array)) {
            array = [array];
        }

        for (const string of array) {
            for (const [, name, value] of string.matchAll(/([^= ]+)=([^;]+)/g)) {
                if (COOKIE_ATTRIBUTES_REGEXP.test(name)) {
                    continue; // skip attributes
                }

                if (value) {
                    this.set(name, value);
                } else {
                    this.delete(name);
                }
            }
        }
    }

    /**
     * Konstruktor untuk menginisialisasi CookieStore dengan cookie.
     * @param {Object} init - Objek yang berisi cookie yang ingin diatur.
     */
    constructor(init) {
        if (typeof init === "object") {
            for (const name in init) {
                const options = init[name];
                this.set(options);
            }
        }
    }

    /**
     * Menghapus cookie berdasarkan nama.
     * @param {string|Object} name - Nama cookie yang ingin dihapus.
     */
    delete(name) {
        let options = normalizeCookie(name);
        delete this[options.name];
    }

    /**
     * Mendapatkan nilai cookie berdasarkan nama.
     * @param {string|Object} name - Nama cookie yang ingin diambil.
     * @returns {string|undefined} - Nilai cookie atau undefined jika tidak ditemukan.
     */
    get(name) {
        let options = normalizeCookie(name);
        return this[options.name];
    }

    /**
     * Mendapatkan semua nilai cookie dengan nama yang sama.
     * @param {string|Object} name - Nama cookie yang ingin diambil.
     * @returns {Array} - Array yang berisi semua nilai cookie yang ditemukan.
     */
    getAll(name) {
        let options = normalizeCookie(name);
        return [].concat(this[options.name]).filter(Boolean);
    }

    /**
     * Mengatur cookie dengan nama dan nilai.
     * @param {string|Object} name - Nama cookie.
     * @param {string} value - Nilai cookie.
     */
    set(name, value) {
        let options = normalizeCookie(name, value);
        this[options.name] = options;
    }
}

// test CookieStore
// passed
// {
//     const cookieStore = new CookieStore()
//     cookieStore.set('name','value')
//     cookieStore.set('name2','value2')
//     cookieStore.set('name3','value3')
//     console.log(cookieStore)
// }

// // passed
// {
//     const cookieStore = new CookieStore()

//     const testdata = [
//         "sessionId=38afes7a8",
//         "id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT",
//         "id=a3fWa; Max-Age=2592000",
//         "qwerty=219ffwef9w0f; Domain=somecompany.co.uk",
//         "sessionId=e8bb43229de9; Domain=foo.example.com",
//         "__Secure-ID=123; Secure; Domain=example.com",
//         "__Host-ID=123; Secure; Path=/",
//         "__Secure-id=1",
//         "__Host-id=1; Secure",
//         "__Host-id=1; Secure; Path=/; Domain=example.com",
//         "__Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;",

//         ]

//     cookieStore.cookie=testdata[0] // with string
//     cookieStore.cookie=testdata // with array

//     console.log(cookieStore.cookie)
// }

CookieStore.normalizeCookie = normalizeCookie;
module.exports = CookieStore;
