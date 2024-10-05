const Validators = {
    /**
     * Validator untuk memeriksa apakah nilai tidak kosong.
     *
     * @param {string} [message="required value"] - Pesan error yang akan dilempar jika validasi gagal.
     * @returns {function} - Fungsi validator yang akan memvalidasi nilai.
     * @throws {Error} - Jika nilai kosong, undefined, atau null.
     */
    required:
        (message = "required value") =>
        (value) => {
            if (value === undefined || value === null || value === "") {
                throw new Error(message);
            }
        },

    /**
     * Validator untuk memeriksa panjang minimal string.
     *
     * @param {number} minLength - Panjang minimal yang valid.
     * @param {string} [message="invalid min length"] - Pesan error jika panjang string kurang dari minLength.
     * @returns {function} - Fungsi validator yang akan memvalidasi panjang string.
     * @throws {Error} - Jika panjang string kurang dari minLength.
     */
    minLength:
        (minLength, message = "invalid min length") =>
        (value) => {
            if (value.length < minLength) {
                throw new Error(message);
            }
        },

    /**
     * Validator untuk memeriksa panjang maksimal string.
     *
     * @param {number} maxLength - Panjang maksimal yang valid.
     * @param {string} [message="invalid max length"] - Pesan error jika panjang string melebihi maxLength.
     * @returns {function} - Fungsi validator yang akan memvalidasi panjang string.
     * @throws {Error} - Jika panjang string melebihi maxLength.
     */
    maxLength:
        (maxLength, message = "invalid max length") =>
        (value) => {
            if (value.length > maxLength) {
                throw new Error(message);
            }
        },

    /**
     * Validator untuk memeriksa nilai minimal.
     *
     * @param {number} min - Nilai minimal yang valid.
     * @param {string} [message="invalid min value"] - Pesan error jika nilai kurang dari min.
     * @returns {function} - Fungsi validator yang akan memvalidasi nilai.
     * @throws {Error} - Jika nilai kurang dari min.
     */
    min:
        (min, message = "invalid min value") =>
        (value) => {
            if (value < min) {
                throw new Error(message);
            }
        },

    /**
     * Validator untuk memeriksa nilai maksimal.
     *
     * @param {number} max - Nilai maksimal yang valid.
     * @param {string} [message="invalid max value"] - Pesan error jika nilai melebihi max.
     * @returns {function} - Fungsi validator yang akan memvalidasi nilai.
     * @throws {Error} - Jika nilai melebihi max.
     */
    max:
        (max, message = "invalid max value") =>
        (value) => {
            if (value > max) {
                throw new Error(message);
            }
        },

    /**
     * Validator untuk memeriksa apakah nilai cocok dengan pola regex.
     *
     * @param {RegExp|string} pattern - Pola regex yang valid.
     * @param {string} [message="invalid pattern"] - Pesan error jika nilai tidak sesuai dengan pola.
     * @returns {function} - Fungsi validator yang akan memvalidasi nilai.
     * @throws {Error} - Jika nilai tidak cocok dengan pola regex.
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
 * Memeriksa validitas data menggunakan validator yang ditentukan dalam opsi.
 *
 * @param {object} data - Objek data yang akan divalidasi, berisi pasangan key-value untuk setiap properti yang ingin diperiksa.
 * @param {object} options - Opsi validasi, berisi pasangan key dengan validator yang akan diterapkan ke properti yang bersangkutan.
 * @throws {Error} Jika validasi tidak berhasil pada salah satu properti data.
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

// const options = {
//     user: [
//         Validators.required(),
//     ],
//     pass: [
//         Validators.required(),
//     ]
// }

// const data = {
//     user: 'name',
//     pass: 'word'
// }

// checkValidity(data, options)

module.exports = {
    Validators,
    checkValidity,
};
