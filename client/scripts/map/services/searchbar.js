'use strict';
var servicename = 'searchbar';

module.exports = function(app) {

    var dependencies = ['uiGmapGoogleMapApi', '$q'];

    function service(uiGmapGoogleMapApi, $q) {

        var _autocompleteService;
        var getAutocompleteService = function(maps) {
            if(!_autocompleteService) {
                _autocompleteService = new maps.places.AutocompleteService();
            }
            return _autocompleteService;
        };

        var getAddresses = function(address) {
            //take a string and return a promise which data is an array of Objects
            //these Object contains the address and other properties (adress in the property .description)
            var deferred = $q.defer();

            var request = {
                input: address,
                types: ['geocode']
            };
            uiGmapGoogleMapApi.then(function(maps) {
                var autocompleteService = getAutocompleteService(maps);
                if(autocompleteService) {
                    autocompleteService.getQueryPredictions(request, function(response, status) {
                        if(status !== maps.places.PlacesServiceStatus.OK) {
                            deferred.reject(status);
                        } else {
                            deferred.resolve(response);
                        }
                    });
                } else {
                    deferred.reject('autoCompleteService not defined');
                }

            });

            return deferred.promise;
        };

        var _placeService;
        var getPlaceService = function(maps) {
            if(!_placeService) {
                _placeService = new maps.places.PlacesService(document.createElement('div'));
            }
            return _placeService;
        };

        var getAddressDetails = function(placeId) {
            //take the place_id of an object returned by getAdress(...) and return an objetc
            //with details on it
            var deferred = $q.defer();
            var request = {
                placeId: placeId
            };
            uiGmapGoogleMapApi.then(function(maps) {
                var placeService = getPlaceService(maps);
                if(placeService) {
                    placeService.getDetails(request, function(response, status) {
                        if(status === maps.places.PlacesServiceStatus.OK) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject(status);
                        }
                    });
                } else {
                    deferred.reject('placeService not defined');
                }

            });

            return deferred.promise;
        };
        return {
            getAddresses: getAddresses,
            getAddressDetails: getAddressDetails
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
