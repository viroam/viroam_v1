'use strict';
var controllername = 'apartmentsCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = [app.name+'.apartments','$kinvey'];

    function controller(apartments,$kinvey) {
        var vm = this;
        vm.message = 'Hello World';

        var promise = $kinvey.ping();
        promise.then(function(response) {
            console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
        }, function(error) {
            console.log('Kinvey Ping Failed. Response: ' + error.description);
        });

        apartments.createApartment(0,10,12);
        apartments.createApartment(1,30,13);
        apartments.deleteApartment(0);
        //apartments.deleteApartment(2);

        for (var i = 3; i < 10; i++) {
            apartments.createApartment(i,40,10+(i-3)*0.1);
        }

        for (var j = 10; j < 16; j++) {
            apartments.createApartment(j,40+(j-10)*0.1,10);
        }

        apartments.deleteApartment(1);

        // vm.aparts = apartments.locateApartments(40,10,2);//tableau?
        // for (var k = 0; k < aparts.length; k++) {
        //     console.log(aparts[k]);
        // }
        var promiseAparte = $kinvey.DataStore.get('apartments', '10');

        promiseAparte.then(function(response) {
            console.log('Aparte 10 trouvé, response: ' + response);
            //console.log(promiseAparte.$$state);
            vm.aparte0 = promiseAparte;
        }, function(error) {
            console.log('Aparte 10 pas trouvé, error: ' + error.description);
        });
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};