'use strict';
var controllername = 'apartmentsCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = [app.name + '.apartments', '$kinvey'];

    function controller(apartments, $kinvey) {
        var vm = this;
        vm.message = 'Hello World';
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};