'use strict';

module.exports = function(app) {
    // inject:start
    require('./apartmentsCtrl')(app);
    // inject:end
};