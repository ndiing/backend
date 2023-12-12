const { read, write } = require("./file");

/**
 * Represents a store for cookies.
 */
class CookieStore {
    constructor(init) {
        if (init) {
            for (const name in init) {
                const cookie = init[name];
                this.set(cookie);
            }
        }
    }
    delete(name) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name };
        }
        delete this[cookie.name];
    }
    get(name) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name };
        }
        return this[cookie.name];
    }
    getAll(name) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name };
        }
        return [this[cookie.name]];
    }
    set(name, value) {
        let cookie = name;
        if (typeof cookie !== "object") {
            cookie = { name, value };
        }
        this[cookie.name] = cookie;
    }
    get cookie() {
        const array = [];
        for (const name of Object.getOwnPropertyNames(this)) {
            const value = this[name].value;
            array.push([name, value].join("="));
        }
        return array.join("; ");
    }
    set cookie(value) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        const regex = /(Domain|Expires|HttpOnly|Max-Age|Partitioned|Path|Secure|SameSite)/i;
        for (const string of value) {
            for (const [, name, value] of string.matchAll(/([^= ]+)=([^;]+)/g)) {
                if (regex.test(name)) {
                    continue;
                }
                if (value) {
                    this.set(name, value);
                } else {
                    this.delete(name);
                }
            }
        }
    }
}
/**
 * Represents a simple in-memory database.
 */
class DB {
    /**
     * Constructs a DB instance.
     * @param {Array<Object>} [docs=[]] - Initial documents for the database.
     */
    constructor(docs = []) {
        this.docs = docs;
    }

    /**
     * Adds a new document to the database.
     * @param {Object} [doc={}] - The document to be added.
     * @throws {Error} Throws an error if the document already exists.
     */
    post(doc = {}) {
        if (doc._id === undefined) {
            throw new Error("Dokumen _id tidak boleh kosong");
        }
        const index = this.docs.findIndex((oldDoc) => oldDoc._id == doc._id);
        if (index !== -1) {
            throw new Error("Dokumen sudah ada");
        }
        this.docs.push(doc);
    }

    /**
     * Retrieves a document from the database.
     * @param {Object} [doc={}] - The document to retrieve.
     * @throws {Error} Throws an error if the document doesn't exist.
     * @returns {Object} The retrieved document.
     */
    get(doc = {}) {
        if (doc._id === undefined) {
            throw new Error("Dokumen _id tidak boleh kosong");
        }
        const index = this.docs.findIndex((oldDoc) => oldDoc._id == doc._id);
        if (index === -1) {
            throw new Error("Dokumen tidak ada");
        }
        return this.docs.find((oldDoc) => oldDoc._id == doc._id);
    }

    /**
     * Updates a document in the database.
     * @param {Object} [doc={}] - The document containing updates.
     * @throws {Error} Throws an error if the document doesn't exist.
     */
    patch(doc = {}) {
        if (doc._id === undefined) {
            throw new Error("Dokumen _id tidak boleh kosong");
        }
        const index = this.docs.findIndex((oldDoc) => oldDoc._id == doc._id);
        if (index === -1) {
            throw new Error("Dokumen tidak ada");
        }

        const oldDoc = this.docs[index];
        for (const name in doc) {
            oldDoc[name] = doc[name];
        }
        this.docs.splice(index, 1, oldDoc);
    }

    /**
     * Deletes a document from the database.
     * @param {Object} [doc={}] - The document to delete.
     * @throws {Error} Throws an error if the document doesn't exist.
     */
    delete(doc = {}) {
        if (doc._id === undefined) {
            throw new Error("Dokumen _id tidak boleh kosong");
        }
        const index = this.docs.findIndex((oldDoc) => oldDoc._id == doc._id);
        if (index === -1) {
            throw new Error("Dokumen tidak ada");
        }

        this.docs.splice(index, 1);
    }

    /**
     * Replaces or adds a document to the database.
     * @param {Object} [doc={}] - The document to replace or add.
     */
    put(doc = {}) {
        if (doc._id === undefined) {
            throw new Error("Dokumen _id tidak boleh kosong");
        }
        const index = this.docs.findIndex((oldDoc) => oldDoc._id == doc._id);
        if (index !== -1) {
            const oldDoc = this.docs[index];
            for (const name in doc) {
                oldDoc[name] = doc[name];
            }
            this.docs.splice(index, 1, oldDoc);
        } else {
            this.docs.push(doc);
        }
    }

    /**
     * @type {Object}
     * Contains comparison operators for filtering.
     */
    get operators() {
        return {
            _lt: (a, b) => a < b,
            _gt: (a, b) => a > b,
            _lte: (a, b) => a <= b,
            _gte: (a, b) => a >= b,
            _eq: (a, b) => new RegExp(`^${b}$`, "i").test(a),
            _ne: (a, b) => a !== b,
            _like: (a, b) => new RegExp(b, "i").test(a),
        };
    }
    set operators(value) {}

    /**
     * Sorts an array based on provided sort options.
     * @param {Array<Object>} array - The array to be sorted.
     * @param {Array<Object>} sortOptions - Options for sorting the array.
     * @returns {Array<Object>} The sorted array.
     */
    multiSort(array, sortOptions) {
        return array.sort((a, b) => {
            for (let i = 0; i < sortOptions.length; i++) {
                const sortField = sortOptions[i].field;
                const sortOrder = sortOptions[i].order === "asc" ? 1 : -1;

                if (a[sortField] < b[sortField]) {
                    return -1 * sortOrder;
                }
                if (a[sortField] > b[sortField]) {
                    return 1 * sortOrder;
                }
            }
            return 0;
        });
    }

    /**
     * Filters an array based on provided filter criteria.
     * @param {Array<Object>} array - The array to be filtered.
     * @param {Array<Object>} filterCriteria - Criteria for filtering the array.
     * @returns {Array<Object>} The filtered array.
     */
    multiFilter(array, filterCriteria) {
        return array.filter((item) =>
            filterCriteria.every((criteria) => {
                const { field, value } = criteria;
                const [, name, operator = "_eq"] = field.match(new RegExp(`^(\\w+?)(${Object.keys(this.operators).join("|")})?$`));
                return this.operators[operator](item[name], value);
            })
        );
    }

    /**
     * Performs a full-text search on an array.
     * @param {Array<Object>} array - The array to be searched.
     * @param {string} searchQuery - The query string for full-text search.
     * @returns {Array<Object>} The filtered array based on the search query.
     */
    fullTextSearch(array, searchQuery) {
        return array.filter((item) => {
            const values = Object.values(item).map((value) => String(value).toLowerCase());
            return values.some((value) => value.includes(searchQuery.toLowerCase()));
        });
    }

    /**
     * @type {Object}
     * Contains properties for query options.
     */
    get properties() {
        return {
            _page: Number,
            _limit: Number,
            _sort: Number,
            _order: Number,
            _start: Number,
            _end: Number,
            q: String,
        };
    }
    set properties(value) {}

    /**
     * Retrieves all documents based on provided options.
     * @param {Object} [options={}] - Options for querying the database.
     * @param {number} [options._page] - Page number for pagination.
     * @param {number} [options._limit] - Limit for the number of items per page.
     * @param {Array<string>} [options._sort] - Fields to sort by.
     * @param {Array<string>} [options._order] - Sort order (asc/desc).
     * @param {number} [options._start] - Starting index for data slicing.
     * @param {number} [options._end] - Ending index for data slicing.
     * @param {string} [options.q] - Search query for full-text search.
     * @returns {Object} An object containing data based on applied options.
     */
    getAll(options = {}) {
        // options = {
        //     _page: undefined,
        //     _limit: undefined,
        //     _sort: undefined,
        //     _order: undefined,
        //     _start: undefined,
        //     _end: undefined,
        //     q: undefined,
        //     ...options,
        // };
        let data = this.docs.slice();

        // Sort
        options._sort = [].concat(options._sort).filter(Boolean);
        options._order = [].concat(options._order).filter(Boolean);
        const sortOptions = options._sort.map((value, index) => ({
            field: value,
            order: options._order[index] || "asc",
        }));
        if (sortOptions?.length) {
            data = this.multiSort(data, sortOptions);
        }

        // Filter
        // Operators
        const names = Object.keys(options).filter((name) => !Object.keys(this.properties).includes(name));
        const filterCriteria = names.map((name) => ({ field: name, value: options[name] }));
        if (filterCriteria.length) {
            data = this.multiFilter(data, filterCriteria);
        }

        // Full-text search
        if (options.q !== undefined) {
            data = this.fullTextSearch(data, options.q);
        }

        const total = data.length;

        options._start = Number(options._start);
        options._end = Number(options._end);
        options._page = Number(options._page);
        options._limit = Number(options._limit);

        // Slice
        if (isNaN(options._start) && isNaN(options._end)) {
            options._start = (options._page - 1) * options._limit;
            options._end = options._start + options._limit;
        }

        // Paginate
        if (!isNaN(options._start) && !isNaN(options._end)) {
            data = data.slice(options._start, options._end);
        }

        return {
            data,
            ...(sortOptions.length && { sorters: sortOptions }),
            ...(filterCriteria.length && { filters: filterCriteria }),
            ...(options.q !== undefined && { q: options.q }),
            total,
            ...(!isNaN(options._start) && { _start: options._start }),
            ...(!isNaN(options._end) && { _end: options._end }),
            ...(!isNaN(options._page) && { _page: options._page }),
            ...(!isNaN(options._limit) && { _limit: options._limit }),
        };
    }
}

/**
 * Represents a data store.
 */
class Store {
    constructor(file, data = {}) {
        this.file = file;
        this.data = read(this.file, data);
        this.data.cookieStore = new CookieStore(this.data.cookieStore);
        this.data.db = new DB(this.data.db?.docs);
        return new Proxy(this.data, this);
    }
    get(target, name) {
        if (["[object Array]", "[object Object]"].includes(toString.call(target[name]))) {
            return new Proxy(target[name], this);
        }
        return target[name];
    }
    set(target, name, value) {
        const oldValue = target[name];
        if (oldValue === value) {
            return true;
        }
        Reflect.set(target, name, value);
        write(this.file, this.data);
        return true;
    }
    deleteProperty(target, name) {
        const oldValue = target[name];
        if (oldValue === undefined) {
            return true;
        }
        Reflect.deleteProperty(target, name);
        write(this.file, this.data);
        return true;
    }
}

module.exports = Store;

// // Usage example
// const db = new DB([
//     { _id: "uuid1", name: "satu", pass: "word" },
//     { _id: "uuid2", name: "dua", pass: "word" },
//     { _id: "uuid3", name: "tiga", pass: "word" },
//     { _id: "uuid4", name: "empat", pass: "word" },
// ]);
// // console.log(db.post({name:'satu'}))
// console.log(db.getAll({ name: "satu" }));
