// config/index.js

const joi = require('joi-browser');
const serverconf = require('./server');

// CONFIGURATION SCHEMA! EDIT HERE!
const configSchema = joi.object({
        SOCKET_SERVER: joi.string().uri()
            .required()
    }).unknown()
    .required()

// Validation
const joival = joi.validate(serverconf, configSchema);

if (joival.error) { throw new Error(`Config validation error: ${joival.error.message}`) };
const validatedConfig = joival.value;

// Exporting config values
const config = {
    server: validatedConfig.SOCKET_SERVER
}

module.exports = config;
