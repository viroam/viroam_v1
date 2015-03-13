'use strict';

module.exports = function(app) {
    // inject:start
    require('./secure')(app);
    require('./vrScrollView')(app);
    // inject:end
};