const fs = require("fs");
const path = require("path");

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
