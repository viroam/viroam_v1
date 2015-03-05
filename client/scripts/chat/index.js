'use strict';
require('angular-ui-router');
require('angular-ionic');
require('famous-angular');
require('ngCordova');
require('kinvey-angular');

var modulename = 'chat';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, ['ui.router', 'ionic', 'famous.angular', 'ngCordova']);
    // inject:folders start
    require('./controllers')(app);
    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.state('chat', {
                url: '/chat',
                template: require('./views/chat.html'),
                controller: fullname + '.chatCtrl',
                controllerAs: 'vm'
            });
        }
    ]);

    return app;
};