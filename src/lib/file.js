const fs = require("fs");
const path = require("path");

/**
 * Reads data from a file.
 * If the file has a '.json' extension, attempts to parse the content as JSON.
 * If the file doesn't exist, writes the provided data to the file.
 * @param {string} file - The path to the file.
 * @param {*} data - The default data to write if the file doesn't exist.
 * @returns {*} The data read from the file or the provided data.
 */
function read(file, data) {
    try {
        data = fs.readFileSync(file, {
            encoding: "utf8",
        });
        if (/\b\.json\b/.test(file)) {
            data = JSON.parse(data);
        }
    } catch (error) {
        write(file, data);
    }
    return data;
}

/**
 * Writes data to a file.
 * If the file has a '.json' extension, converts data to JSON format before writing.
 * @param {string} file - The path to the file.
 * @param {*} data - The data to write to the file.
 */
function write(file, data) {
    const dir = path.dirname(file);
    try {
        fs.readdirSync(dir);
    } catch (error) {
        fs.mkdirSync(dir, {
            recursive: true,
        });
    }
    if (/\b\.json\b/.test(file)) {
        if (/\b\.min\b/.test(file)) {
            data = JSON.stringify(data);
        } else {
            data = JSON.stringify(data, null, 4);
        }
    }
    fs.writeFileSync(file, data);
}

// Usage example
// write('./data/name/default.json',{})
// console.log(read('./data/name/default.json'))

module.exports = {
    read,
    write,
};
