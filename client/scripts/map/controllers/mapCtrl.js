'use strict';
var controllername = 'mapCtrl';

module.exports = function(app) {
    /*jshint validthis: true */
    var databroker = require('../../databroker')(app.name.split('.')[0]).name;
    var deps = [databroker + '.apartments', 'uiGmapGoogleMapApi', '$scope', '$timeout', '$famous'];

    function controller(apartments, uiGmapGoogleMapApi, $scope, $timeout, $famous) {
        var vm = this;

        var Transitionable = $famous['famous/transitions/Transitionable'];
        var Easing = $famous['famous/transitions/Easing'];
        vm.mapView = new Transitionable([0, 0, 0]);
        vm.chatView = new Transitionable([375, 0, 0]);
        vm.profileView = new Transitionable([-375, 0, 0]);
        vm.nextButton = new Transitionable([-200, 500, 1000]);
        vm.aboutButton = new Transitionable([375, 500, 1000]);
        vm.oopsie = new Transitionable([0, 0, -1000]);

        vm.goToChat = function() {
            vm.chatView.set([0, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
            vm.mapView.set([-375, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
        };

        vm.goToVideo = function() {
            if(vm.videos.length !== 0) {
                for(var i = 0; i < vm.videos.length; i++) {
                    vm.videos[i].translate.set([0, i * 675, 2 * i], {
                        duration: 1000,
                        curve: 'easeInOut'
                    });
                }

                vm.mapView.set([0, -675, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.nextButton.set([50, 500, 1], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.aboutButton.set([230, 500, 1], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
            } else {
                vm.infoButton = 'Pas de vidéos :(';
            }

        };

        vm.goToNext = function() {

            for(var i = 0; i < vm.videos.length; i++) {
                vm.videos[i].translate.set([0, (i - 1) * 675, 2 * (i - 1)], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
            }

            $timeout(function() {
                vm.videos.shift();
            }, 1000);

            // if (vm.videos.length === 0) {
            //     vm.oopsie = new Transitionable([0, 0, 0]);
            //     vm.videos[i].translate.set([0, (i - 1) * 675, 2 * (i - 1)], {
            //         duration: 1000,
            //         curve: 'easeInOut'
            //     });
            // };
        };

        vm.goToProfile = function() {
            vm.profileView.set([0, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
            vm.mapView.set([375, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
        };

        vm.backToMapFromProfile = function() {
            vm.profileView.set([-375, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
            vm.mapView.set([0, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
        };

        vm.backToMapFromChat = function() {
            vm.chatView.set([375, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
            vm.mapView.set([0, 0, 0], {
                duration: 1000,
                curve: 'easeInOut'
            });
        };

        vm.backToMapFromVideo = function() {
            if(vm.videos.length !== 0) {
                vm.videos[0].translate.set([0, 675, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.mapView.set([0, 0, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.nextButton.set([-200, 500, 1], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.aboutButton.set([375, 500, 1], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
            }

            if(vm.videos.length === 0) {
                vm.oopsie.set([0, 675, -1000], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.mapView.set([0, 0, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
            }
        };

        vm.map = {
            center: {
                latitude: 51.514276,
                longitude: -0.104860
            },
            zoom: 10,
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
                        vm.infoButton = 'Visualiser les ' + vm.number + ' vidéos';
                        vm.videos = [];
                        if(vm.number > 0) {
                            for(var i = 1; i < vm.number + 1; i++) {
                                vm.videos.push({
                                    name: 'Video_' + i,
                                    translate: new Transitionable([0, i * 675, 2 * i])
                                });
                            }
                        } else {
                            vm.videos = [];
                        }
                    }, function(error) {});

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
            radius: 5000,
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

        vm.riseRadius = function() {
            vm.circle.radius = vm.circle.radius + 1000;
        };

        vm.lowRadius = function() {
            if(vm.circle.radius > 1000) {
                vm.circle.radius = vm.circle.radius - 1000;
            }
        };

        // uiGmapGoogleMapApi.then(function(maps) {
        //     function initialize() {
        //         // Create the autocomplete object, restricting the search
        //         // to geographical location types.
        //         var autocomplete;
        //         autocomplete = new google.maps.places.Autocomplete(
        //             /** @type {HTMLInputElement} */
        //             document.getElementById('autocomplete'), {
        //                 types: ['geocode']
        //             });
        //         // When the user selects an address from the dropdown,
        //         // populate the address fields in the form.
        //     }

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
        }, function(error) {});
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
