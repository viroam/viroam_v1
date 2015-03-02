'use strict';

var namespace = 'main';

var angular = require('angular');
var app = angular.module(namespace, [
    // inject:modules start
    // inject:modules end
]);

var runDeps = ['$window'];
var run = function($window) {
    
};

run.$inject = runDeps;
app.run(run);

module.exports = app;