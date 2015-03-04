'use strict';

module.exports = function(app) {
    // inject:start
    require('./apartments')(app);
    // inject:end
};