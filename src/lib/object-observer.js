/**
 * Kelas ObjectObserver digunakan untuk mengamati perubahan pada objek JavaScript.
 */
class ObjectObserver {
    /**
     * Membuat instance ObjectObserver.
     * @param {Object} [target={}] - Objek yang ingin diamati.
     * @param {Function} [callback=() => {}] - Fungsi callback yang dipanggil saat terjadi perubahan.
     */
    constructor(target = {}, callback = () => {}) {
        this.target = target;
        this.callback = callback;

        return new Proxy(this.target, this);
    }

    /**
     * Metode ini dipanggil saat properti dari objek diakses.
     * @param {Object} target - Objek yang sedang diamati.
     * @param {string} property - Nama properti yang diakses.
     * @returns {any} - Nilai dari properti yang diakses.
     */
    get(target, property) {
        if (["[object Object]", "[object Array]"].includes(toString.call(target[property]))) {
            return new Proxy(target[property], this);
        }

        return target[property];
    }

    /**
     * Metode ini dipanggil saat properti diubah.
     * @param {Object} target - Objek yang sedang diamati.
     * @param {string} property - Nama properti yang diubah.
     * @param {any} value - Nilai baru untuk properti tersebut.
     * @returns {boolean} - Mengembalikan true jika operasi berhasil.
     */
    set(target, property, value) {
        const oldValue = target[property];
        if (oldValue === value) {
            return true;
        }

        Reflect.set(target, property, value);

        this.callback(this.target);

        return true;
    }

    /**
     * Metode ini dipanggil saat properti dihapus.
     * @param {Object} target - Objek yang sedang diamati.
     * @param {string} property - Nama properti yang dihapus.
     * @returns {boolean} - Mengembalikan true jika operasi berhasil.
     */
    deleteProperty(target, property) {
        const oldValue = target[property];
        if (oldValue === undefined) {
            return true;
        }

        Reflect.deleteProperty(target, property);

        this.callback(this.target);

        return true;
    }
}

// // test store
// // passed
// {
//     const store = new ObjectObserver({},console.log)
//     store.name='value'
//     store.object = {}
//     store.object.name='value'
//     console.log(store)
// }

module.exports = ObjectObserver;
