'use strict';
var servicename = 'calculator';
// var check = require('check-params');
module.exports = function(app) {

    var dependencies = [];

    function service() {
        var add = function(a, b) {
            // check(a, 'a', not.null);
            if(b === null) {
                throw new Error('b cannot be null');
            }
            return a + b;
        };

        return {
            add: add
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
