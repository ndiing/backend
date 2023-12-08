// Importing read and write functions from the 'file' module
const { read, write } = require("./file");

// Importing flatten and unflatten functions from the 'helper' module
const { flatten, unflatten } = require("./helper");

// Path to the configuration file
const configFile = "./config.json";

// Variable to hold the configuration data
let config;

// Read the configuration file or initialize an empty object if the file doesn't exist
config = read(configFile, {});

// Unflatten the configuration data (if it was flattened previously)
config = unflatten(config);

// Export the current configuration
module.exports = config;

// Define a version for the configuration
const version = "1.0.0";

// Check if the stored version in the configuration matches the current version
if (config.version !== version) {
    // Update the version in the configuration to the current version
    config.version = version;

    // Check and set default values for HTTP and HTTPS configurations if they don't exist
    if (!config.http) config.http = { port: 80 };
    if (!config.https) config.https = { port: 443, options: { key: null, cert: null } };

    // Flatten the configuration data (making it a single-level object)
    config = flatten(config);

    // Write the updated configuration back to the file
    write(configFile, config);
}
