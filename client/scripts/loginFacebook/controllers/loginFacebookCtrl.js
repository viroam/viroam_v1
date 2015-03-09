'use strict';
var controllername = 'loginFacebookCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$kinvey'];

    function controller($kinvey) {
        var vm = this;
        vm.message = 'Hello World';

        var promise = $kinvey.Social.connect(null, 'facebook');
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};