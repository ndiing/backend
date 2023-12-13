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

module.exports = {
    delay,
    flatten,
    unflatten,
}

// // Usage example
// // delay().then(console.log)
// var data={
//     user:{
//         name:'',
//         address:[
//             'line1',
//             'line2',
//         ]
//     }
// }
// var flattened=flatten(data)
// console.log(flattened)
// var unflattened=unflatten(flattened)
// console.log(unflattened)
