/**
 * Objek berisi validator untuk memeriksa nilai.
 */
const Validators = {
    /**
     * Memeriksa apakah nilai tidak null, undefined, atau string kosong.
     *
     * @param {string} [message="required value"] - Pesan kesalahan jika validasi gagal.
     * @returns {function} - Fungsi validasi yang memeriksa nilai.
     */
    required:
        (message = "required value") =>
        (value) => {
            if (value === undefined || value === null || value === "") {
                throw new Error(message);
            }
        },

    /**
     * Memeriksa apakah panjang nilai lebih besar dari atau sama dengan minLength.
     *
     * @param {number} minLength - Panjang minimum yang diharapkan.
     * @param {string} [message="invalid min length"] - Pesan kesalahan jika validasi gagal.
     * @returns {function} - Fungsi validasi yang memeriksa panjang nilai.
     */
    minLength:
        (minLength, message = "invalid min length") =>
        (value) => {
            if (value.length < minLength) {
                throw new Error(message);
            }
        },

    /**
     * Memeriksa apakah panjang nilai lebih kecil dari atau sama dengan maxLength.
     *
     * @param {number} maxLength - Panjang maksimum yang diharapkan.
     * @param {string} [message="invalid max length"] - Pesan kesalahan jika validasi gagal.
     * @returns {function} - Fungsi validasi yang memeriksa panjang nilai.
     */
    maxLength:
        (maxLength, message = "invalid max length") =>
        (value) => {
            if (value.length > maxLength) {
                throw new Error(message);
            }
        },

    /**
     * Memeriksa apakah nilai lebih besar dari atau sama dengan min.
     *
     * @param {number} min - Nilai minimum yang diharapkan.
     * @param {string} [message="invalid min value"] - Pesan kesalahan jika validasi gagal.
     * @returns {function} - Fungsi validasi yang memeriksa nilai.
     */
    min:
        (min, message = "invalid min value") =>
        (value) => {
            if (value < min) {
                throw new Error(message);
            }
        },

    /**
     * Memeriksa apakah nilai lebih kecil dari atau sama dengan max.
     *
     * @param {number} max - Nilai maksimum yang diharapkan.
     * @param {string} [message="invalid max value"] - Pesan kesalahan jika validasi gagal.
     * @returns {function} - Fungsi validasi yang memeriksa nilai.
     */
    max:
        (max, message = "invalid max value") =>
        (value) => {
            if (value > max) {
                throw new Error(message);
            }
        },

    /**
     * Memeriksa apakah nilai cocok dengan pola regex yang diberikan.
     *
     * @param {string} pattern - Pola regex untuk validasi.
     * @param {string} [message="invalid pattern"] - Pesan kesalahan jika validasi gagal.
     * @returns {function} - Fungsi validasi yang memeriksa pola nilai.
     */
    pattern:
        (pattern, message = "invalid pattern") =>
        (value) => {
            if (!new RegExp(pattern).test(value)) {
                throw new Error(message);
            }
        },
};

/**
 * Memeriksa validitas data berdasarkan opsi validasi yang diberikan.
 *
 * @param {Object} data - Objek data yang akan divalidasi.
 * @param {Object} options - Opsi validasi yang berisi nama dan metode validasi.
 * @throws {Error} - Membuang kesalahan jika salah satu validasi gagal.
 */
function checkValidity(data, options) {
    for (const name in data) {
        const methods = [].concat(options[name]).filter(Boolean);
        const value = data[name];
        if (methods) {
            for (const method of methods) {
                method(value);
            }
        }
    }
}

module.exports = {
    Validators,
    checkValidity,
};

// {
//     const data={
//         user:'ismyusername',
//         pass:'word'
//     }
//     const options={
//         user:[
//             Validators.required(),
//             Validators.minLength(10),
//         ]
//     }
//     checkValidity(data,options)
// }
