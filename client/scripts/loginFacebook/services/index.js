'use strict';

module.exports = function(app) {
    // inject:start
    require('./loginFb')(app);
    // inject:end
};