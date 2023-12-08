/**
 * Delays the execution by a specified number of milliseconds.
 * @param {number} [ms=1000] - The number of milliseconds to delay the execution.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
function delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Function to flatten nested objects.
 *
 * @param {Object} obj - The object to flatten.
 * @returns {Object} - Flattened object.
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
 * Function to unflatten nested objects.
 *
 * @param {Object} obj - The object to unflatten.
 * @returns {Object} - Unflattened object.
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

// // Usage example

// var data={
//     server:{
//         http:{
//             port:80
//         },
//         https:{
//             port:443,
//             options:{
//                 key:null,
//                 cert:null,
//             }
//         },
//     }
// }

// data=flatten(data)
// console.log(data)

// data=unflatten(data)
// console.log(data)

module.exports = {
    delay,
    flatten,
    unflatten,
};
