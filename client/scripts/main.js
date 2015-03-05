'use strict';

var namespace = 'main';

var angular = require('angular');
require('kinvey-angular');
var app = angular.module(namespace, [
	'kinvey',
    // inject:modules start
    require('./databroker')(namespace).name,
        require('./houseProfile')(namespace).name,
        require('./map')(namespace).name
    // inject:modules end
]);

var runDeps = ['$window', '$kinvey', '$state', '$rootScope'];
var run = function($window, $kinvey, $state, $rootScope) {

    $kinvey.init({
        appKey: 'kid_WJa8jZzb3',
        appSecret: 'a69bedf4cb034fc08a5c0f8321f557fe'
    }).then(function() {
        if(!$kinvey.getActiveUser()) {
            $kinvey.User.login('Username', 'Password');
            $state.go('houseProfile');
        } else {
            $state.go('houseProfile');
        }
    });

    $rootScope.windowWidth = $window.innerWidth;
    $rootScope.windowHeight = $window.innerHeight;
};

run.$inject = runDeps;
app.run(run);

module.exports = app;
