// config/index.js
const serverconf = require('./server');
const mapconf = require('./map');

// Combine all config
const allconf = {
    server: serverconf,
    map: mapconf
};

module.exports = allconf;
