'use strict';
var controllername = 'loginFacebookCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$kinvey', '$cordovaFacebook'];

    function controller($kinvey, $cordovaFacebook) {
        var vm = this;
        vm.message = 'Hello World';

        vm.userName = '';
        vm.email = '';
        vm.gender = '';

        vm.nameProperties = {
            color: 'white',
            fontSize: '1.3em',
            border: '1px solid black'
        };

        vm.buttonProperties = {
            //border: '1px solid black'
        };

        vm.cordovaFacebookLogin = function() {
            //remplace le kinvey.login ??
            //normalement oui, le user actif de kinvey apres l'appel de cette méthode sera celui lié au compte facebook
            var promise = $cordovaFacebook.login(['public_profile', 'email', 'user_friends']);
            promise.then(function(result) {
                console.log('cordovaFacebookLogin success');
                console.log(result);
                var tokens = {
                    access_token: result.authResponse.accessToken,
                    expires_in: result.authResponse.expiresIn
                };
                $kinvey.User.loginWithProvider('facebook', tokens).then(function(response) {
                    console.log('loginWithProvider success');
                }, function(error) {
                    console.log('loginWithProvider failed');
                    if($kinvey.Error.USER_NOT_FOUND === error.name) {
                        $kinvey.User.signupWithProvider('facebook', tokens);
                    } else {
                        console.log(error.description);
                    }
                });
                // var promise = $kinvey.User.loginWithProvider('facebook', {//tester aussi signupWithProvider pr voir si il trouve le user deja créé
                // access_token : result.authResponse.accessToken,
                // expires_in   : result.authResponse.expiresIn
                // }).then(function(response) {
                //     console.log('loginWithProvider success');
                //     console.log(response);
                // }, function(error) {
                //     console.log('loginWithProvider error');
                //     console.log(error.description);
                // });
            }, function(error) {
                console.log('cordovaFacebookLogin error');
                console.log(error.description);
            });
        };

        vm.cordovaFacebookLogout = function() {
            $cordovaFacebook.logout().then(function(response) {
                console.log('cordovaFacebookLogout success');
                console.log(response);
            }, function(error) {
                console.log('cordovaFacebookLogout error');
                console.log(error.description);
            });
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

        vm.displayUserInfos = function() {
            //we dispose of userID from facebook
            $cordovaFacebook.getLoginStatus().then(function(response) {
                console.log('getLoginStatus success');
                console.log(response);
                if(response.status === 'connected') {
                    var user = $kinvey.getActiveUser();
                    vm.userName = user._socialIdentity.facebook.name;
                    vm.email = user._socialIdentity.facebook.email;
                    vm.gender = user._socialIdentity.facebook.gender;
                } else {
                    alert('user not logged in with facebook');
                }
            }, function(error) {
                console.log('displayUserInfos error');
                console.log(error.description);
            });
        };

        //A faire:

        // vm.kinveySignupWithProvider = function() {
        //     // $cordovaFacebook.getLoginStatus().then(function(response) {
        //     //     console.log('displayUserInfos success');
        //     //     console.log(response);
        //     // }, function(error) {
        //     //     console.log('displayUserInfos error');
        //     //     console.log(error.description);
        //     // });

        //     // $kinvey.User.signupWithProvider('facebook', {
        //     //         access_token : result.authResponse.accessToken,
        //     //         expires_in   : result.authResponse.expiresIn
        //     //     }).then(function(signupProvider) {
        //     //         console.log('kinveySignupWithProvider success');
        //     //         console.log(signupProvider);
        //     //     }, function(error) {
        //     //         console.log('kinveySignupWithProvider error');
        //     //         console.log(error.description);
        //     //     });
        // };

        vm.kinveyGetActiveUser = function() {
            var user = $kinvey.getActiveUser();
            console.log(user);
        };
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};