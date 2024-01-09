const fs = require("fs");
const path = require("path");
const { replacer, reviver } = require("./helper");

/**
 * Reads data from a file synchronously, handling JSON files.
 *
 * @param {string} file - The file path to read.
 * @param {*} data - Default data if the file doesn't exist.
 * @returns {*} The data read from the file or default data.
 */
function read(file, data) {
    try {
        data = fs.readFileSync(file, { encoding: "utf8" });

        if (/\b\.json\b/.test(file)) {
            data = JSON.parse(data, reviver);
        }
    } catch (error) {
        // console.log(error)
        write(file, data);
    }
    return data;
}

/**
 * Writes data to a file synchronously, handling JSON files.
 *
 * @param {string} file - The file path to write to.
 * @param {*} data - The data to write.
 */
function write(file, data) {
    const dir = path.dirname(file);
    try {
        fs.readdirSync(dir);
    } catch (error) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (/\b\.json\b/.test(file)) {
        if (/\b\.min\b/.test(file)) {
            data = JSON.stringify(data, replacer);
        } else {
            data = JSON.stringify(data, replacer, 4);
        }
    }

    fs.writeFileSync(file, data);
}

module.exports = {
    read,
    write,
};

// // Usage example
// write("./data/name/default.json", {});
// var data = read("./data/name/default.json");
// console.log(data);
