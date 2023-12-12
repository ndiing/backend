/**
 * Converts a string to PascalCase.
 * @param {string} string - The input string to convert.
 * @returns {string} - The string converted to PascalCase.
 */
function toPascalCase(string) {
    return string.replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2) => $2.toUpperCase()).replace(/[^a-zA-Z0-9]+$/g, "");
}

/**
 * Converts a string to camelCase.
 * @param {string} string - The input string to convert.
 * @returns {string} - The string converted to camelCase.
 */
function toCamelCase(string) {
    return string.replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2, $$) => ($$ === 0 ? $2.toLowerCase() : $2.toUpperCase())).replace(/[^a-zA-Z0-9]+$/g, "");
}

/**
 * Converts a string to kebab-case.
 * @param {string} string - The input string to convert.
 * @returns {string} - The string converted to kebab-case.
 */
function toKebabCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "-" + $2)
        .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, ($, $1) => "-" + $1)
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
        .toLowerCase();
}

/**
 * Converts a string to snake_case.
 * @param {string} string - The input string to convert.
 * @returns {string} - The string converted to snake_case.
 */
function toSnakeCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "_" + $2)
        .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, ($, $1) => "_" + $1)
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
        .toLowerCase();
}

/**
 * Converts a string to Title Case.
 * @param {string} string - The input string to convert.
 * @returns {string} - The string converted to Title Case.
 */
function toTitleCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + " " + $2.toUpperCase())
        .replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2, $$) => ($$ === 0 ? "" : " ") + $2.toUpperCase())
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}
module.exports = { toPascalCase, toCamelCase, toKebabCase, toSnakeCase, toTitleCase };

// // Usage example
// var data = [
//     "KebabCaseKebabCase",
//     " -_KebabCaseKebabCase_- ",
//     "kebabCaseKebabCase",
//     " -_kebabCaseKebabCase_- ",
//     "kebab-case-kebab-case",
//     " -_kebab-case-kebab-case_- ",
//     "kebab_case_kebab_case",
//     " -_kebab_case_kebab_case_- ",
//     "Kebab Case Kebab Case",
//     " -_Kebab Case Kebab Case_- ",
// ];
// console.log(data.map(toPascalCase));
// console.log(data.map(toCamelCase));
// console.log(data.map(toKebabCase));
// console.log(data.map(toSnakeCase));
// console.log(data.map(toTitleCase));
