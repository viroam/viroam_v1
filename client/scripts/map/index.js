'use strict';
require('angular-ui-router');
require('angular-ionic');
require('famous-angular');
require('ngCordova');
require('angular-google-maps');

var modulename = 'map';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, ['ui.router', 'ionic', 'famous.angular', 'ngCordova', 'uiGmapgoogle-maps']);
    // inject:folders start
    require('./controllers')(app);
    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider',
        function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyDVC1rjvZ-w-OscxPCp6EMZomcbE-xLOOY',
                v: '3.17',
                libraries: 'places' // Required for SearchBox.
            });

            $urlRouterProvider.otherwise('/');
            $stateProvider.state('map', {
                url: '/',
                template: require('./views/map.html'),
                controller: fullname + '.mapCtrl',
                controllerAs: 'vm'
            });
        }
    ]);

    return app;
};
