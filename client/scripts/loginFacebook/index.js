'use strict';
require('angular-ui-router');
require('angular-ionic');
require('famous-angular');
require('ngCordova');

var modulename = 'loginFacebook';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, ['ui.router', 'ionic', 'famous.angular', 'ngCordova']);
    // inject:folders start
    require('./controllers')(app);
    require('./services')(app);
    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.state('loginFacebook', {
                url: '/loginFacebook',
                template: require('./views/loginFacebook.html'),
                controller: fullname + '.loginFacebookCtrl',
                controllerAs: 'vm'
            });
        }
    ]);

    return app;
};