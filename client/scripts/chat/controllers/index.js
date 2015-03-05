'use strict';

module.exports = function(app) {
    // inject:start
    require('./chatCtrl')(app);
    // inject:end
};