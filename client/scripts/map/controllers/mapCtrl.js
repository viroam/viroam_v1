'use strict';
var controllername = 'mapCtrl';

module.exports = function(app) {
    /*jshint validthis: true */
    var databroker = require('../../databroker')(app.name.split('.')[0]).name;
    var deps = [databroker + '.apartments', 'uiGmapGoogleMapApi', '$scope', '$timeout'];

    function controller(apartments, uiGmapGoogleMapApi, $scope, $timeout) {

        var vm = this;
        vm.map = {
            center: {
                latitude: 51.514276,
                longitude: -0.104860
            },
            zoom: 8,
            options: {
                zoomControl: true,
                streetViewControl: false,
                scaleControl: false,
                mapTypeControl: false
            },
            bounds: {},
            events: {
                bounds_changed: function(map) {
                    vm.buttonstatus = 'visible';
                    vm.circle.center = {
                        latitude: map.center.lat(),
                        longitude: map.center.lng()
                    };
                    vm.currentcenter = [vm.circle.center.longitude, vm.circle.center.latitude];
                    var aparts = apartments.locateApartments(vm.currentcenter[0], vm.currentcenter[1], vm.circle.radius / 1609.344);
                    aparts.then(function(response) {
                        vm.number = response.length;
                    }, function(error) {
                        console.log(error.description);
                    });
                },
                dragstart: function(map) {
                    vm.buttonstatus = 'invisible';
                }
            }
        };

        vm.searchbox = {
            template: 'searchbox.tpl.html',
            events: {
                places_changed: function(searchBox) {
                    var place = searchBox.getPlaces();
                    vm.map.center = {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    };
                    vm.map.zoom = 8;
                }
            }
        };

        vm.circle = {
            center: {
                latitude: 51.523729,
                longitude: -0.098852
            },
            radius: 10000,
            stroke: {
                color: '#333300',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#FFCC33',
                opacity: 0.5
            },
            visible: true,
            events: {}
        };

        // vm.markers = [{
        //     id: 1,
        //     coords: {
        //         longitude: -0.232748,
        //         latitude: 51.529710
        //     }
        // }, {
        //     id: 2,
        //     coords: {
        //         longitude: -0.199789,
        //         latitude: 51.536544
        //     }
        // }, {
        //     id: 3,
        //     coords: {
        //         longitude: -0.091986,
        //         latitude: 51.533981
        //     }
        // }, {
        //     id: 4,
        //     coords: {
        //         longitude: -0.060400,
        //         latitude: 51.493386
        //     }
        // }, {
        //     id: 5,
        //     coords: {
        //         longitude: -0.143484,
        //         latitude: 51.474572
        //     }
        // }, {
        //     id: 6,
        //     coords: {
        //         longitude: -0.027441,
        //         latitude: 51.567712
        //     }
        // }, {
        //     id: 7,
        //     coords: {
        //         longitude: 0.004831,
        //         latitude: 51.482269
        //     }
        // }, {
        //     id: 8,
        //     coords: {
        //         longitude: -0.099539,
        //         latitude: 51.503645
        //     }
        // }, {
        //     id: 9,
        //     coords: {
        //         longitude: -0.217642,
        //         latitude: 51.492103
        //     }
        // }, {
        //     id: 10,
        //     coords: {
        //         longitude: 0.134607,
        //         latitude: 51.640212
        //     }
        // }];

        // uiGmapGoogleMapApi.then(function(maps) {
        //     vm.myLatlng = new google.maps.LatLng(51.523729, -0.098852);
        //     // var cercleoption = {
        //     //     map: maps,
        //     //     center: myLatlng,
        //     //     radius: 10000
        //     // }
        //     // vm.cityCircle2 = new google.maps.Circle(cercleoption);

        //     // console.log(maps.getCenter());
        // });
        var apartsPromise = apartments.getAllApartments();
        apartsPromise.then(function(response) {
            var collocsVisible = response;
            vm.coordsArray = [];
            for(var i = 0; i < collocsVisible.length; i++) {
                var coordsTemp = {
                    coords: {
                        latitude: collocsVisible[i]._geoloc[1],
                        longitude: collocsVisible[i]._geoloc[0]
                    },
                    id: collocsVisible[i]._id
                };
                vm.coordsArray.push(coordsTemp);
            }
        }, function(error) {
            console.log(error.description);
        });
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
