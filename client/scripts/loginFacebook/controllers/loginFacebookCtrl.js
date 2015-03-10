'use strict';
var controllername = 'loginFacebookCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$kinvey', '$cordovaFacebook', app.name + '.loginFb'];

    function controller($kinvey, $cordovaFacebook, loginFb) {
        var vm = this;
        vm.message = 'Hello World';

        vm.userName = '';
        vm.email = '';
        vm.gender = '';
        vm.pictureUrl = '';

        vm.nameProperties = {
            color: 'white',
            fontSize: '1.3em',
            border: '1px solid black'
        };

        vm.buttonProperties = {
            //border: '1px solid black'
        };

        vm.kinveyLogout = function() {
            var user = $kinvey.getActiveUser();
            if(null !== user) {
                var logout = $kinvey.User.logout();
                logout.then(function(response) {
                    console.log('kinveyLogout success');
                    console.log(response);
                }, function(error) {
                    console.log('kinveyLogout error');
                    console.log(error.description);
                });
            }
        };

        vm.kinveyGetActiveUser = function() {
            var user = $kinvey.getActiveUser();
            console.log(user);
        };

        vm.cordovaFacebookLogout = function() {
            loginFb.logout();
        };
        vm.cordovaFacebookLogin = function() {
            loginFb.login();
        };
        vm.displayUserInfos = function() {
            var infos = loginFb.getUserInfos();
            vm.userName = infos.userName;
            vm.email = infos.email;
            vm.gender = infos.gender;
            // vm.pictureUrl = 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/p200x200/943006_10151628370874406_1534687560_n.jpg?oh=308a64abea34324c6fb4c1b4dd8d5b7c&oe=558FCEB1&__gda__=1434236993_1588ac72b0cab5217a22c71d64206e19';
            loginFb.getPictureUrl().then(function(response) {
                vm.pictureUrl = response.data.url;
            });
        };

        vm.api = function() {
            $cordovaFacebook.api('me/picture?type=large&redirect=false', ['public_profile'])
            .then(function(success) {
                console.log('api success');
                console.log(success.data.url);
            }, function(error) {
                console.log('api error');
                console.log(error.description);
            });
        };
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};