function delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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
module.exports = { delay, flatten, unflatten };
