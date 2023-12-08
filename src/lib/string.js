function toPascalCase(string) {
    return string.replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2) => $2.toUpperCase()).replace(/[^a-zA-Z0-9]+$/g, "");
}

function toCamelCase(string) {
    return string.replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2, $$) => ($$ === 0 ? $2.toLowerCase() : $2.toUpperCase())).replace(/[^a-zA-Z0-9]+$/g, "");
}

function toKebabCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "-" + $2)
        .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, ($, $1) => "-" + $1)
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
        .toLowerCase();
}

function toSnakeCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "_" + $2)
        .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, ($, $1) => "_" + $1)
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
        .toLowerCase();
}

function toTitleCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + " " + $2.toUpperCase())
        .replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2, $$) => ($$ === 0 ? "" : " ") + $2.toUpperCase())
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}
module.exports = { toPascalCase, toCamelCase, toKebabCase, toSnakeCase, toTitleCase };
