'use strict';
require('angular-ui-router');
require('angular-ionic');
require('famous-angular');
require('ngCordova');

var modulename = 'databroker';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename; // =main.databroker

    var angular = require('angular');
    var app = angular.module(fullname, ['ui.router', 'ionic', 'famous.angular', 'ngCordova']);
    // inject:folders start
    require('./controllers')(app);
    require('./services')(app);
    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('login', {
                url: '/',
                template: require('./views/login.html')
            }).state('home', {
                url: '/home',
                template: require('./views/apartment.html'),
                controller:fullname+'.apartmentsCtrl',
                controllerAs:'vm'
            });
        }
    ]);

    return app;
};
















