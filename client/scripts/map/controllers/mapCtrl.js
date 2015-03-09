'use strict';
var controllername = 'mapCtrl';

module.exports = function(app) {
    /*jshint validthis: true */
    var databroker = require('../../databroker')(app.name.split('.')[0]).name;
    var deps = [app.name + '.searchbar', databroker + '.apartments', 'uiGmapGoogleMapApi', '$scope', '$timeout', '$famous', '$rootScope', '$cordovaCapture'];

    function controller(searchbar, apartments, uiGmapGoogleMapApi, $scope, $timeout, $famous, $rootScope, $cordovaCapture) {
        var vm = this;

        vm.windowWidth = $rootScope.windowWidth;
        vm.windowHeight = $scope.windowHeight;

        var Transitionable = $famous['famous/transitions/Transitionable'];
        var Easing = $famous['famous/transitions/Easing'];
        var EventHandler = $famous['famous/core/EventHandler'];

        vm.mapView = new Transitionable([0, 0, 0]);
        vm.chatView = new Transitionable([vm.windowWidth, 0, 0]);
        vm.profileView = new Transitionable([-vm.windowWidth, 0, 0]);
        vm.nextButton = new Transitionable([-vm.windowWidth, 0.80 * vm.windowHeight, 1000]);
        vm.aboutButton = new Transitionable([1.65 * vm.windowWidth, 0.80 * vm.windowHeight, 1000]);

        vm.myEventHandler = new EventHandler();

        vm.recordVideo = function() {
            var options = { limit: 3, duration: 15 };

            $cordovaCapture.captureVideo(options).then(function(videoData) {
              // Success! Video data is here
            }, function(err) {
              // An error occurred. Show a message to the user
            });
        };

        vm.views = [{
            color: 'red'
        }, {
            color: 'blue'
        }, {
            color: 'green'
        }, {
            color: 'yellow'
        }];

        vm.chatScrollView = {
            options: {
                clipsize: 100,
                paginated: false,
                speedLimit: 5,
                direction: 0
            }
        };

        vm.goToChat = function() {
            vm.chatView.set([0, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
            vm.mapView.set([-vm.windowWidth, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
        };

        vm.goToVideo = function() {
            if(vm.videos.length !== 0) {
                for(var i = 0; i < vm.videos.length; i++) {
                    vm.videos[i].translate.set([0, i * vm.windowHeight, 2 * i], {
                        duration: 1000,
                        curve: 'easeInOut'
                    });
                }

                vm.mapView.set([0, -vm.windowHeight, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.nextButton.set([0.10 * vm.windowWidth, 0.80 * vm.windowHeight, 1000], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.aboutButton.set([0.55 * vm.windowWidth, 0.80 * vm.windowHeight, 1000], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
            } else {
                vm.infoButton = 'Pas de vidéos :(';
            }

        };

        vm.goToNext = function() {

            if(vm.videos.length > 1) {
                for(var i = 0; i < vm.videos.length; i++) {
                    vm.videos[i].translate.set([0, (i - 1) * vm.windowHeight, 2 * (i - 1)], {
                        duration: 1000,
                        curve: 'easeInOut'
                    });
                }

                $timeout(function() {
                    vm.videos.shift();
                }, 1000);
            } else {
                vm.nextContent = 'No more videos';
            }

        };

        vm.goToProfile = function() {
            vm.profileView.set([0, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
            vm.mapView.set([vm.windowWidth, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
        };

        vm.backToMapFromProfile = function() {
            vm.profileView.set([-vm.windowWidth, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
            vm.mapView.set([0, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
        };

        vm.backToMapFromChat = function() {
            vm.chatView.set([vm.windowWidth, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
            vm.mapView.set([0, 0, 0], {
                duration: 100,
                curve: 'easeInOut'
            });
        };

        vm.backToMapFromVideo = function() {
            if(vm.videos.length !== 0) {
                vm.videos[0].translate.set([0, vm.windowHeight, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.mapView.set([0, 0, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.nextButton.set([-vm.windowWidth, 0.80 * vm.windowHeight, 1], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
                vm.aboutButton.set([1.65 * vm.windowWidth, 0.80 * vm.windowHeight, 1], {
                    duration: 1000,
                    curve: 'easeInOut'
                });
            } else {
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
                                    translate: new Transitionable([0, i * vm.windowHeight, 2 * i])
                                });
                                vm.nextContent = 'Next';
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

        vm.searchBarStyle = {
            width: 0.75 * vm.windowWidth + 'px',
            height: 0.05 * vm.windowHeight + 'px'
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
                    id: collocsVisible[i]._id,
                    price: collocsVisible[i].price
                };
                vm.coordsArray.push(coordsTemp);
            }
        }, function(error) {});

        vm.inputChange = function() {
            searchbar.getAdresses(vm.inputAddress).then(function(data) {
                vm.searchbarPredictions = data;
            }, function(err) {
            });
        };

        vm.getDetails = function(placeId) {
            searchbar.getAdressDetails(placeId).then(function(data) {
                vm.placeDetails = data;
            }, function(err) {
            });
        };

    }
    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
