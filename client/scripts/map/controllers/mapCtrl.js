'use strict';
var controllername = 'mapCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['uiGmapGoogleMapApi', '$scope', '$timeout'];

    function controller(uiGmapGoogleMapApi, $scope, $timeout) {

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
                    vm.buttonstatus = "visible";
                    vm.circle.center = {
                        latitude: map.center.lat(),
                        longitude: map.center.lng()
                    };
                    vm.currentcenter = [vm.circle.center.longitude, vm.circle.center.latitude];
                },
                dragstart: function(map) {
                    vm.buttonstatus = "invisible";
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
            events: {
            }
        };

        vm.collocs = [{
            name: 'colloc_1',
            idKey: 'colloc_1',
            coords: {
                longitude: -0.198931,
                latitude: 51.515985
            }
        }, {
            name: 'colloc_2',
            idKey: 'colloc_2',
            coords: {
                longitude: -0.189318,
                latitude: 51.534995
            }
        }, {
            name: 'colloc_3',
            idKey: 'colloc_3',
            coords: {
                longitude: -0.112585,
                latitude: 51.546206
            }
        }, {
            name: 'colloc_4',
            idKey: 'colloc_4',
            coords: {
                longitude: -0.114302,
                latitude: 51.515771
            }
        }, {
            name: 'colloc_5',
            idKey: 'colloc_5',
            coords: {
                longitude: -0.129408,
                latitude: 51.494722
            }
        }, {
            name: 'colloc_6',
            idKey: 'colloc_6',
            coords: {
                longitude: -0.052847,
                latitude: 51.534675
            }
        }, {
            name: 'colloc_7',
            idKey: 'colloc_7',
            coords: {
                longitude: -0.090612,
                latitude: 51.495790
            }
        }, {
            name: 'colloc_8',
            idKey: 'colloc_8',
            coords: {
                longitude: -0.110525,
                latitude: 51.507545
            }
        }, {
            name: 'colloc_9',
            idKey: 'colloc_9',
            coords: {
                longitude: -0.091642,
                latitude: 51.487026
            }
        }, {
            name: 'colloc_10',
            idKey: 'colloc_10',
            coords: {
                longitude: -0.156187,
                latitude: 51.480612
            }
        }];

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

        vm.collocsvisible = [];

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
