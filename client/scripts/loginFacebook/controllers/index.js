'use strict';

module.exports = function(app) {
    // inject:start
    require('./loginFacebookCtrl')(app);
    // inject:end
};