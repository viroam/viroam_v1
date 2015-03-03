'use strict';

var namespace = 'main';

var angular = require('angular');
require('kinvey-angular');
var app = angular.module(namespace, [
	'kinvey'
    // inject:modules start
    require('./map')(namespace).name
    // inject:modules end
]);

var runDeps = ['$window', '$kinvey'];
var run = function($window, $kinvey) {

    $kinvey.init({
        appKey: 'kid_WJa8jZzb3',
        appSecret: 'a69bedf4cb034fc08a5c0f8321f557fe'
    });
};

run.$inject = runDeps;
app.run(run);

module.exports = app;
