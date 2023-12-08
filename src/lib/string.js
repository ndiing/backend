/**
 * Converts a string to PascalCase.
 * @param {string} string - The input string.
 * @returns {string} The string converted to PascalCase.
 */
function toPascalCase(string) {
    return string //
        .replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2) => $2.toUpperCase()) //
        .replace(/[^a-zA-Z0-9]+$/g, "");
}


/**
 * Converts a string to camelCase.
 * @param {string} string - The input string.
 * @returns {string} The string converted to camelCase.
 */
function toCamelCase(string) {
    return string //
        .replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2, $$) => ($$ === 0 ? $2.toLowerCase() : $2.toUpperCase())) //
        .replace(/[^a-zA-Z0-9]+$/g, "");
}

/**
 * Converts a string to kebab-case.
 * @param {string} string - The input string.
 * @returns {string} The string converted to kebab-case.
 */
function toKebabCase(string) {
    return (
        string
            //
            .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "-" + $2)
            //
            .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, ($, $1) => "-" + $1)
            //
            .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
            .toLowerCase()
    );
}


/**
 * Converts a string to snake_case.
 * @param {string} string - The input string.
 * @returns {string} The string converted to snake_case.
 */
function toSnakeCase(string) {
    return (
        string
            //
            .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "_" + $2)
            //
            .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, ($, $1) => "_" + $1)
            //
            .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
            .toLowerCase()
    );
}

/**
 * Converts a string to Title Case.
 * @param {string} string - The input string.
 * @returns {string} The string converted to Title Case.
 */
function toTitleCase(string) {
    return (
        string
            //
            .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + " " + $2.toUpperCase())
            //
            .replace(/([^a-zA-Z0-9]+|^)([a-zA-Z0-9])/g, ($, $1, $2, $$) => ($$ === 0 ? "" : " ") + $2.toUpperCase())
            //
            .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
    );
}

// // Usage example
// var data=[
//     'PascalCasePascalCase',
//     'camelCaseCamelCase',
//     'kebab-case-kebab-case',
//     'snake_case_snake_case',
//     'Title Case Title Case',
//     '-_PascalCasePascalCase-_',
//     ' camelCaseCamelCase ',
//     '-_kebab-case-kebab-case-_',
//     '-_snake_case_snake_case-_',
//     '-_Title Case Title Case-_',
// ]

// // data=data.map(toPascalCase)
// // data=data.map(toCamelCase)
// // data=data.map(toKebabCase)
// // data=data.map(toSnakeCase)
// // data=data.map(toTitleCase)

// console.log(data)

// Export the functions as a module
module.exports = {
    toPascalCase,
    toCamelCase,
    toKebabCase,
    toSnakeCase,
    toTitleCase,
};
