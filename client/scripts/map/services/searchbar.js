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

        var getAdresses = function(address) {

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

        var getAdressDetails = function(placeId) {
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
            getAdresses: getAdresses,
            getAdressDetails: getAdressDetails
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
