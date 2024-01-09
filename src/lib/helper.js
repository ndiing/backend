const { execSync } = require("child_process");

/**
 * Delays the execution of a function for a specified time.
 *
 * @param {number} [ms=1000] - The time in milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
function delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flattens an object into a single-depth object with concatenated keys.
 *
 * @param {Object} obj - The object to be flattened.
 * @returns {Object} The flattened object.
 */
function flatten(obj) {
    let flattened = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            const flatObject = flatten(obj[key]);
            Object.keys(flatObject).forEach((nestedKey) => {
                flattened[`${key}.${nestedKey}`] = flatObject[nestedKey];
            });
        } else {
            flattened[key] = obj[key];
        }
    });
    return flattened;
}

/**
 * Unflattens a previously flattened object into its original structure.
 *
 * @param {Object} obj - The flattened object to be unflattened.
 * @returns {Object} The unflattened object.
 */
function unflatten(obj) {
    let result = {};
    for (const key in obj) {
        const keys = key.split(".");
        keys.reduce((acc, currentKey, index) => {
            if (!acc[currentKey]) {
                acc[currentKey] = isNaN(keys[index + 1]) ? {} : [];
            }
            if (index === keys.length - 1) {
                acc[currentKey] = obj[key];
            }
            return acc[currentKey];
        }, result);
    }
    return result;
}

/**
 * Sets the proxy server settings in Windows registry.
 * @param {boolean} enable - Flag to enable or disable the proxy server.
 * @param {string} [hostname="127.0.0.1"] - Hostname or IP address of the proxy server.
 * @param {number} [port=8888] - Port number of the proxy server.
 * @returns {boolean} - Indicates if the proxy server settings were successfully set.
 */
function setProxyServer(enable, hostname = "127.0.0.1", port = 8888) {
    const ProxyEnable = enable ? 1 : 0;
    const ProxyServer = enable ? `http=${hostname}:${port};https=${hostname}:${port};ftp=${hostname}:${port}` : "";
    execSync(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d ${ProxyEnable} /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /d "${ProxyServer}" /f`);
    return true;
}

/**
 * Retrieves the proxy server settings from Windows registry.
 * @returns {Array<string>} - Array containing proxy server settings in the format "protocol://hostname:port".
 *                           Returns null if the proxy is disabled.
 */
function getProxyServer() {
    const stdout = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable', { encoding: "utf8" });
    if (stdout.includes("0x1")) {
        const stdout = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer', { encoding: "utf8" });
        return Array.from(stdout.matchAll(/([^=; ]+)=([^=;\r\n]+)/g), ([, name, value]) => [name, value].join("://"));
    }
    return null;
}

/**
 * Installs a trusted root certificate in the system's root certificate store.
 * @param {string} dir - Directory containing the root certificate file.
 * @returns {boolean} - Indicates if the root certificate was successfully installed.
 */
function installTrustedRootCertificate(dir = process.cwd()) {
    execSync(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c cd ${dir} && certutil -enterprise -addstore -f root ${dir}/root.crt'"`, { shell: "powershell" });
    return true;
}
/**
 * Replaces special values in a JSON string during serialization.
 *
 * @param {string | number} key - The current key being processed.
 * @param {*} value - The value corresponding to the key.
 * @returns {*} - Returns the modified value for serialization.
 */
function replacer(key, value) {
    if (toString.call(value).includes("[object RegExp]")) {
        return value.toString();
    }
    return value;
}

/**
 * Revives special values in a JSON string during parsing.
 *
 * @param {string | number} key - The current key being processed.
 * @param {*} value - The value corresponding to the key.
 * @returns {*} - Returns the modified value after parsing.
 */
function reviver(key, value) {
    if (typeof value === "string") {
        const [, pattern, flags] = value.match(/^\/(.*)\/(.*)?$/) || [];
        if (pattern) {
            return new RegExp(pattern, flags);
        }
    }
    return value;
}

// // Usage example
// var data = [
//     {
//         method: /^\/api/i,
//         url: /.*/,
//         whitelist: [
//             /^(?:127(?:\.(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])){3}|(?:10|192\.168)(?:\.(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])){2})$/,
//         ],
//     },
// ];

// data = JSON.stringify(data, replacer);
// data = JSON.parse(data, reviver);
// console.log(data);

module.exports = {
    delay,
    flatten,
    unflatten,
    setProxyServer,
    getProxyServer,
    installTrustedRootCertificate,
    replacer,
    reviver,
};

// // Usage example
// // delay().then(console.log)
// var data = {
//     user: {
//         name: "",
//         address: ["line1", "line2"],
//     },
// };
// var flattened = flatten(data);
// console.log(flattened);
// var unflattened = unflatten(flattened);
// console.log(unflattened);
