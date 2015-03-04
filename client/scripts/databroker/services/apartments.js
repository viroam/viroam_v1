'use strict';
var servicename = 'apartments';

module.exports = function(app) {

    var dependencies = ['$kinvey'];

    function service($kinvey) {
        //var add = function(a, b) {
        //    return a + b;
        //};
        var createApartment = function(id, longitude, latitude) {
            //create an entity in the apartments collection
            var promise = $kinvey.DataStore.save('apartments', {//pas oublier de créer la collection apartments
            _id  : id,
            _geoloc : [longitude, latitude]
            });

            promise.then(function(response) {
                console.log('apartment succesfully added, reponse: ' + response.description);
            }, function(error) {
                console.log('error, apartment failed to be added, error :' + error.description);
            });
        };

        var deleteApartment = function(id) {
             //delete an entity in the apartments collection
            var promise = $kinvey.DataStore.destroy('apartments', id);
            promise.then(function(response) {
                console.log('apartment succesfully deleted, reponse: ' + response.description);
            }, function(error) {
                console.log('error, apartment failed to be deleted, error :' + error.description);
            });
        };

        var locateApartments = function(longitude, latitude, radius) {//radius: in mile
            //return the entities in the requested circle
            var query = new $kinvey.Query();
            query.near('_geoloc', [longitude, latitude], radius);
            var aparts = $kinvey.DataStore.find('apartments', query);
            aparts.then(function(response) {
                console.log('apartments located, reponse: ' + response.description);
            }, function(error) {
                console.log('error, apartments failed to be located, error :' + error.description);
            });
            return aparts;
        };

        return {
            //add: add
            createApartment: createApartment,
            deleteApartment: deleteApartment,
            locateApartments: locateApartments
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};











