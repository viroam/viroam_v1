'use strict';
var servicename = 'apartments';

module.exports = function(app) {

    var dependencies = ['$kinvey'];

    function service($kinvey) {
        var createApartment = function(id, longitude, latitude, startDate, endDate, price) {
            //create an entity in the apartments collection
            var promise = $kinvey.DataStore.save('apartments', {
                _id: id,
                _geoloc: [longitude, latitude],
                startDate: startDate,
                endDate: endDate,
                price: price
            });

            promise.then(function(response) {
                //console.log('apartment succesfully added');
            }, function(error) {
                //console.log('error, apartment failed to be added, error :' + error.description);
            });
        };

        var deleteApartment = function(id) {
            //delete an entity in the apartments collection
            var promise = $kinvey.DataStore.destroy('apartments', id);
            promise.then(function(response) {
                //console.log('apartment succesfully deleted');
            }, function(error) {
                //console.log('error, apartment failed to be deleted, error :' + error.description);
            });
        };

        var locateApartments = function(longitude, latitude, radius) { //radius: in mile
            //return the promise with the apartments inside the requested circle
            var query = new $kinvey.Query();
            query.near('_geoloc', [longitude, latitude], radius);
            var aparts = $kinvey.DataStore.find('apartments', query);
            return aparts;
        };

        var getAllApartments = function() {
            //return the promise with all apartments in the collection
            var promise = $kinvey.DataStore.find('apartments');
            return promise;
        };

        return {
            createApartment: createApartment,
            deleteApartment: deleteApartment,
            locateApartments: locateApartments,
            getAllApartments: getAllApartments
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
