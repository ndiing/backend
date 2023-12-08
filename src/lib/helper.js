/**
 * Delays the execution by a specified number of milliseconds.
 * @param {number} [ms=1000] - The number of milliseconds to delay the execution.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
function delay(ms=1000){
    return new Promise(resolve=>setTimeout(resolve,ms))
}

module.exports={
    delay
}