'use strict';
require('angular-ui-router');
require('angular-ionic');
require('famous-angular');
require('ngCordova');
require('angular-google-maps');
require('kinvey-angular');
var modulename = 'map';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var databroker = require('../databroker')(namespace);
    var app = angular.module(fullname, [
        'kinvey',
        'ui.router',
        'ionic',
        'famous.angular',
        'ngCordova',
        'uiGmapgoogle-maps',
        databroker.name
    ]);
    // inject:folders start
    require('./controllers')(app);
    require('./directives')(app);
    require('./services')(app);
    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', '$sceProvider',
        function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $sceProvider) {

            $sceProvider.enabled(false);

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyDVC1rjvZ-w-OscxPCp6EMZomcbE-xLOOY',
                v: '3.17',
                libraries: 'places' // Required for SearchBox.
            });

            $urlRouterProvider.otherwise('/');
            $stateProvider.state('login', {
                url: '/',
                template: require('./views/login.html')
            }).state('map', {
                url: '/map',
                template: require('./views/map.html'),
                controller: fullname + '.mapCtrl',
                controllerAs: 'vm'
            });
        }
    ]);

    return app;
};
