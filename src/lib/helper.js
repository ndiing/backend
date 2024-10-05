const fs = require("fs");
const path = require("path");

function read(filename, data) {
    try {
        data = fs.readFileSync(filename, {
            encoding: "utf8",
        });
        if (/\.json/.test(filename)) {
            data = JSON.parse(data);
        }
    } catch (error) {
        write(filename, data);
    }
    return data;
}

function write(filename, data) {
    const dirname = path.dirname(filename);
    try {
        fs.readdirSync(dirname);
    } catch (error) {
        fs.mkdirSync(dirname, { recursive: true });
    }
    if (/\.json/.test(filename)) {
        data = JSON.stringify(data, null, 4);
    }
    fs.writeFileSync(filename, data);
}

module.exports = {
    read,
    write,
};
