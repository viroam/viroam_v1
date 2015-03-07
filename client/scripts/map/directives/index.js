'use strict';

module.exports = function(app) {
    // inject:start
    require('./secure')(app);
    // inject:end
};