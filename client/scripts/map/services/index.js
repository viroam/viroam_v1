'use strict';

module.exports = function(app) {
    // inject:start
    require('./calculator')(app);
    require('./files')(app);
    require('./rest')(app);
    require('./searchbar')(app);
    // inject:end
};