'use strict';
var servicename = 'rest';

module.exports = function(app) {

    var dependencies = ['$kinvey', '$window'];

    function service($kinvey, $window) {
        var getHeaders = function() {
            var user = $kinvey.getActiveUser();
            return {
                'Authorization': 'Kinvey ' + user._kmd.authtoken,
                'X-Kinvey-API-Version': 3
            };
        };

        var getProtocol = function() {
            var protocol = $window.location.protocol;
            if(protocol.indexOf('http') !== 0) {
                return 'http:';
            }
            return protocol;
        };

        return {
            getHeaders: getHeaders,
            getProtocol: getProtocol
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
