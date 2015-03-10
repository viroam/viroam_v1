'use strict';
var servicename = 'loginFb';

module.exports = function(app) {

    var dependencies = ['$kinvey', '$cordovaFacebook'];

    function service($kinvey, $cordovaFacebook) {
        var add = function(a, b) {
            return a + b;
        };

        var login = function() {
        //login through facebook or create the user if it doesn't exist
        //the active user of kinvey will be the user who signed in
            var promise = $cordovaFacebook.login(['public_profile', 'email', 'user_friends']);
            promise.then(function(result) {
                // console.log('cordovaFacebookLogin success');
                // console.log(result);
                var tokens = {
                    access_token: result.authResponse.accessToken,
                    expires_in: result.authResponse.expiresIn
                };
                $kinvey.User.loginWithProvider('facebook', tokens).then(function(response) {
                    // console.log('loginWithProvider success');
                }, function(error) {
                    // console.log('loginWithProvider failed');
                    if($kinvey.Error.USER_NOT_FOUND === error.name) {
                        $kinvey.User.signupWithProvider('facebook', tokens);
                    }
                });
            }, function(error) {
                // console.log('cordovaFacebookLogin error');
                // console.log(error.description);
            });
        };

        var logout = function() {
            $cordovaFacebook.logout().then(function(response) {
                // console.log('cordovaFacebookLogout success');
                // console.log(response);
            }, function(error) {
                // console.log('cordovaFacebookLogout error');
                // console.log(error.description);
            });
        };

        var getUserInfos = function() {
            //we dispose of userID from facebook
            var infos = {
                userName: '',
                email: '',
                gender: ''
            };
            var user = $kinvey.getActiveUser();
            infos.userName = user._socialIdentity.facebook.name;
            infos.email = user._socialIdentity.facebook.email;
            infos.gender = user._socialIdentity.facebook.gender;
            return infos;
        };

        var isFacebookUser = function(user) {
            return user && user._socialIdentity && user._socialIdentity.facebook;
        };

        var getPictureUrl = function() {
            // return a promise with an Object in the response, to get the url: response.data.url
            return $cordovaFacebook.api('me/picture?type=large&redirect=false', ['public_profile']);
        };

        return {
            login: login,
            logout: logout,
            getUserInfos: getUserInfos,
            isFacebookUser: isFacebookUser,
            getPictureUrl: getPictureUrl
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};