'use strict';
var controllername = 'mapCtrl';

module.exports = function(app) {
    /*jshint validthis: true */
    var databroker = require('../../databroker')(app.name.split('.')[0]).name;
    var deps = [app.name + '.files', app.name + '.searchbar', databroker + '.apartments', 'uiGmapGoogleMapApi', '$scope', '$timeout', '$famous', '$rootScope', '$cordovaCapture', '$kinvey', '$sce'];

    function controller(files, searchbar, apartments, uiGmapGoogleMapApi, $scope, $timeout, $famous, $rootScope, $cordovaCapture, $kinvey, $sce) {
        var vm = this;

        vm.windowWidth = $rootScope.windowWidth;
        vm.windowHeight = $rootScope.windowHeight;

        var Transitionable = $famous['famous/transitions/Transitionable'];

        vm.mapView = new Transitionable([0, 0, 0]);
        vm.chatView = new Transitionable([vm.windowWidth, 0, 0]);
        vm.profileView = new Transitionable([-vm.windowWidth, 0, 0]);
        vm.nextButton = new Transitionable([-vm.windowWidth, 0.80 * vm.windowHeight, 1000]);
        vm.aboutButton = new Transitionable([1.65 * vm.windowWidth, 0.80 * vm.windowHeight, 1000]);
        vm.backButton = new Transitionable([vm.windowWidth, 0.10 * vm.windowHeight, 1000]);
        vm.videoView = new Transitionable([0, vm.windowHeight, 0]);

        vm.recordVideo = function() {

            var options = {
                limit: 1,
                duration: 5
            };

            $cordovaCapture.captureVideo(options).then(function(videoData) {
                // Success! Video data is here
                var filePath;
                filePath = 'file://' + videoData[0].fullPath;
                // if(typeof device !== undefined && device.platform === 'iOS') {
                // } else {
                //     filePath = videoData[0].fullPath;
                // }

                var promise = files.upload(filePath);
                promise.then(function(response) {

                }, function(error) {

                });
            }, function() {
                // An error occurred. Show a message to the user
            });
        };

        // vm.downloadFile = function() {
        //     var promise = $kinvey.File.download('d59635ee-11b9-414f-b4e8-212d7934290f');
        //     promise.then(function(response) {
        //         vm.videoURL = String(response._downloadURL);
        //         console.log(vm.videoURL);
        //     }, function(error) {

        //     });
        // };

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
                paginated: true,
                speedLimit: 5,
                direction: 0
            }
        };

        vm.videoScrollView = {
            options: {
                paginated: true,
                speedLimit: 5,
                direction: 1
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
                vm.videoView.set([0, 0, 0], {
                    duration: 1000,
                    curve: 'easeInOut'
                });

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
                vm.backButton.set([0.325 * vm.windowWidth, 0.10 * vm.windowHeight, 1000], {
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

        vm.playPause = function(i) {
            var video = document.getElementById(i);
            if(video.paused && !video.ended) {
                video.play();
            } else {
                video.pause();
            }
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
                vm.videoView.set([0, vm.windowHeight, 0], {
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
                vm.backButton.set([vm.windowWidth, 0.10 * vm.windowHeight, 1000], {
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
                // bounds_changed: function(map) {
                //     vm.buttonstatus = 'visible';
                //     vm.circle.center = {
                //         latitude: map.center.lat(),
                //         longitude: map.center.lng()
                //     };
                //     vm.currentcenter = [vm.circle.center.longitude, vm.circle.center.latitude];
                //     var aparts = apartments.locateApartments(vm.currentcenter[0], vm.currentcenter[1], vm.circle.radius / 1609.344);
                //     aparts.then(function(response) {
                //         vm.number = response.length;
                //         vm.infoButton = 'Visualiser les ' + vm.number + ' vidéos';
                //         vm.videos = [];
                //         if(vm.number > 0) {
                //             var promise = $kinvey.File.download('d59635ee-11b9-414f-b4e8-212d7934290f');
                //             promise.then(function(response) {
                //                 vm.videoURL = String(response._downloadURL);
                //                 for(var i = 1; i < vm.number + 1; i++) {
                //                     vm.videos.push({
                //                         id: i,
                //                         // translate: new Transitionable([0, i * vm.windowHeight, 2 * i]),
                //                         style: {
                //                             right: 0,
                //                             bottom: 0,
                //                             minWidth: '100%',
                //                             minHeight: '100%',
                //                             width: 'auto',
                //                             height: 'auto'
                //                         },
                //                         idsrc: vm.videoURL
                //                     });
                //                     vm.nextContent = 'Next';

                //                 }
                //             }, function(error) {

                //             });

                //         } else {
                //             vm.videos = [];
                //         }
                //     }, function(error) {});

                // },
                // dragstart: function(map) {
                //     vm.buttonstatus = 'invisible';
                // },
                // zoom_changed: function(map) {
                //     vm.currentZoom = map.getZoom();
                //     vm.groundResolution1 = Math.cos(vm.map.center.latitude * Math.PI * 0.00555556) * 2 * Math.PI * 6378137;
                //     vm.groundResolution2 = 256 * Math.pow(2, vm.currentZoom);
                //     vm.groundResolutionf = vm.groundResolution1 / vm.groundResolution2;
                //     vm.circle.radius = 0.5 * vm.groundResolutionf * vm.circleSize;
                // }
            }
        };

        // vm.groundResolution1 = Math.cos(vm.map.center.latitude * Math.PI * 0.00555556) * 2 * Math.PI * 6378137;
        // vm.groundResolution2 = 256 * Math.pow(2, vm.map.zoom);
        // vm.groundResolutionf = vm.groundResolution1 / vm.groundResolution2;

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

        // vm.circleSize = 0.4 * vm.windowWidth;
        // vm.circleMargin = -0.20 * vm.windowWidth;
        // vm.circle.radius = 0.5 * vm.groundResolutionf * vm.circleSize;

        // vm.getCircleStyle=function(param){
        //     return {
        //          width: param + 'px',

        //     }
        // }
        // vm.circleStyle = {
        //     position: 'absolute',
        //     top: 0.5625 * vm.windowHeight + 'px',
        //     left: 0.5 * vm.windowWidth + 'px',
        //     width: vm.circleSize + 'px',
        //     height: vm.circleSize + 'px',
        //     marginTop: vm.circleMargin + 'px',
        //     marginLeft: vm.circleMargin + 'px'
        // };

        // vm.riseRadiusCircle = function() {
        //     vm.circleSize = vm.circleSize + 0.1 * vm.windowWidth;
        //     vm.circleMargin = vm.circleMargin - 0.05 * vm.windowWidth;
        //     vm.circleStyle.width = vm.circleSize + 'px';
        //     vm.circleStyle.height = vm.circleSize + 'px';
        //     vm.circleStyle.marginTop = vm.circleMargin + 'px';
        //     vm.circleStyle.marginLeft = vm.circleMargin + 'px';
        //     vm.circle.radius = 0.5 * vm.groundResolutionf * vm.circleSize;
        // };

        // vm.lowRadiusCircle = function() {
        //     if(vm.circleSize > 40) {
        //         vm.circleSize = vm.circleSize - 0.1 * vm.windowWidth;
        //         vm.circleMargin = vm.circleMargin + 0.05 * vm.windowWidth;
        //         vm.circleStyle.width = vm.circleSize + 'px';
        //         vm.circleStyle.height = vm.circleSize + 'px';
        //         vm.circleStyle.marginTop = vm.circleMargin + 'px';
        //         vm.circleStyle.marginLeft = vm.circleMargin + 'px';
        //         vm.circle.radius = 0.5 * vm.groundResolutionf * vm.circleSize;
        //     }
        // };

        // var apartsPromise = apartments.getAllApartments();
        // apartsPromise.then(function(response) {
        //     var collocsVisible = response;
        //     vm.coordsArray = [];
        //     for(var i = 0; i < collocsVisible.length; i++) {
        //         var coordsTemp = {
        //             coords: {
        //                 latitude: collocsVisible[i]._geoloc[1],
        //                 longitude: collocsVisible[i]._geoloc[0]
        //             },
        //             id: collocsVisible[i]._id,
        //             price: collocsVisible[i].price
        //         };
        //         vm.coordsArray.push(coordsTemp);
        //     }
        // }, function(error) {});

        vm.inputChange = function() {
            searchbar.getAdresses(vm.inputAddress).then(function(data) {
                vm.searchbarPredictions = data;
            }, function(err) {});
        };

        vm.getDetails = function(placeId) {
            searchbar.getAdressDetails(placeId).then(function(data) {
                vm.placeDetails = data;
            }, function(err) {});
        };

        // var startdate = new Date();
        // var enddate = new Date();
        // apartments.createApartment(2.300368, 47.857842, startdate, enddate, 100, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // apartments.createApartment(-5.300368, 46.857842, startdate, enddate, 200, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // apartments.createApartment(-6.300368, 45.857842, startdate, enddate, 300, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // apartments.createApartment(-7.300368, 44.857842, startdate, enddate, 400, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // apartments.createApartment(-8.300368, 43.857842, startdate, enddate, 500, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // apartments.createApartment(-9.300368, 42.857842, startdate, enddate, 700, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // apartments.createApartment(-10.300368, 41.857842, startdate, enddate, 800, '54be8f51-55d7-4a3d-8645-18b29f3cf75a');
        // vm.saveEvent = function() {
        //     apartments.saveEvent({
        //         name: 'first Event',
        //         location: [{
        //             address: 'BOSTON',
        //             country: {
        //                 name: 'US'
        //             }
        //         }, {
        //             address: 'PARIS',
        //             country: {
        //                 name: 'FRANCE'
        //             }
        //         }]
        //     });
        // };

        vm.createUser = function() {
            var user = $kinvey.getActiveUser();
            if(null !== user) {
                $kinvey.User.logout().then(function(response) {
                    $kinvey.User.login({
                        username: 'JeanStek',
                        password: 'password'
                    });
                });
            }
        };

        vm.associateVideoPerso = function() {
            var user = $kinvey.getActiveUser();
            user.videoPerso = 'Val';
            $kinvey.User.update(user);
        };

        vm.createApartment = function() {
            var startdate = new Date();
            var enddate = new Date();
            apartments.createApartment(-20.300368, 4.857842, startdate, enddate, 15, '54be8f51-55d7-4a3d-8645-18b29f3cf75a').then(function(response) {
                console.log(response);
            });
        };

        vm.getApartmentsToDisplay = function() {
            apartments.getApartmentsToDisplay().then(function(response) {
            });
        };

        // vm.jeMateLaVideo = function() {

        // }

        vm.getChatConversionsForSearchers = function() {
            apartments.getChatConversionsForSearchers().then(function(response) {
                console.log(response);
            });
        };

        vm.getArrayOfApartmentsInCircleForSearchers = function() {
            apartments.getArrayOfApartmentsInCircleForSearchers(-20.300368, 4.857842, 10).then(function(response) {
                console.log(response);
                vm.ApartCiaran = response[1];
            });
        };

        vm.getApartmentsSeenBySearchersEntity = function() {
            apartments.getApartmentsSeenBySearchersEntity().then(function(response) {
                console.log(response);
            });
        };

        vm.updateApartmentsSeenBySearchers = function() {
            apartments.getApartmentsSeenBySearchersEntity().then(function(response) {
                apartments.updateApartmentsSeenBySearchers(vm.ApartCiaran, response);
            });
        };

        vm.updateApartmentsApplied = function() {
            $kinvey.DataStore.get('Apartments', '550208cadc8f1cce040034a1').then(function(response1) {
                apartments.updateApartmentsApplied(response1);
            });
        };

        vm.updateApplicants = function() {
            $kinvey.DataStore.get('Apartments', '550208cadc8f1cce040034a1').then(function(response1) {
                apartments.getApplicantEntity().then(function(response2) {
                    apartments.updateApplicants(response1, response2);
                });
            });
        };

        vm.getChatConversionsForSearchers = function() {
            apartments.getChatConversionsForSearchers().then(function(response) {
                console.log(response);
            });
        };

        vm.getApplicantsFromApartmentsApplied = function() {
            apartments.getApplicantsFromApartmentsApplied().then(function(response) {
                console.log(response);
            });
        };

        vm.getVideoFromApplicantsToBeDisplayed = function() {
            apartments.getVideoFromApplicantsToBeDisplayed().then(function(response) {
                apartments.getUsersFromId(response).then(function(response2) {
                    vm.Applicant = response2[0];
                });
            });
        };

        vm.updateApartmentsAppliedSeenBy = function() {
            apartments.getApartmentsAppliedEntityForOffers(vm.Applicant).then(function(response) {
                apartments.updateApartmentsAppliedSeenBy(response, '55020d18622aa60a5e003567');
            });
        };

        vm.updateChannel = function() {
            return apartments.updateChannel(vm.Applicant, 'Conversation 1');
        };

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
