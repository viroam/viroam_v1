'use strict';
var controllername = 'houseProfileCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var databroker = require('../../databroker')(app.name.split('.')[0]).name;
    var searchbar = require('../../map')(app.name.split('.')[0]).name;
    var deps = ['$rootScope', databroker + '.apartments', searchbar + '.searchbar'];

    function controller($rootScope, apartments, searchbar) {

        var vm = this;

        vm.windowHeight = $rootScope.windowHeight;
        vm.windowWidth = $rootScope.windowWidth;
        var houseIndex = 3000;
        vm.showAddresses = true;//tell wether or not adresses should be displayed in the search bar
        vm.location = {
            longitude: '',
            latitude: ''
        };

        vm.inputZoneProperties = {
            textAlign : 'left',
            border: '2px solid white',
            color: 'white',
            borderRadius: '10px',
            padding: vm.windowWidth / 24 + 'px',
            fontSize: '1.5em',
            lineHeight: vm.windowHeight / 20 + 'px',
            fontWeight: 'bold'
        };
        vm.priceStyle = {
            width: vm.windowWidth / 5 + 'px',
            background: 'transparent',
            border: '0px',
            fontSize: '1.2em',
            textAlign: 'right'
        };

        vm.price = '180';

        vm.dateStyle = {
            width: vm.windowWidth / 2 + 'px',
            display: 'inline',
            background: 'transparent',
            fontSize: '1em'
        };

        vm.startDate = new Date();
        vm.endDate = new Date();

        vm.inputButtonProperties = {
            textAlign : 'center',
            border: '1px solid black',
            borderRadius: '10px',
            padding: vm.windowWidth / 24 + 'px',
            fontSize: '1.5em',
            lineHeight: vm.windowHeight / 20 + 'px',
            fontWeight: 'bold'
        };

        vm.buttonColor = '#AB6377';

        vm.activeButton = function() {
            vm.buttonColor = '#DF3364';
        };

        vm.desactiveButton = function() {
            vm.buttonColor = '#AB6377';
        };

        vm.submitHouse = function() {
            if(vm.location.longitude && vm.address) {//check if the address has been filled
                apartments.createApartment(houseIndex, vm.location.longitude, vm.location.latitude, vm.startDate, vm.endDate, vm.price);
                houseIndex++;
            } else {
                alert('Please give your address');
            }
        };

        vm.updateAddress = function() {
            vm.showAddresses = true; //addresses should be displayed
            if(vm.address.length) {
                searchbar.getAddresses(vm.address).then(function(data) {
                    vm.addressList = data;
                }, function(error) {
                });
            }
        };

        vm.addressStyle = {
            width: 0.45 * vm.windowWidth + 'px',
            // background: 'transparent',
            border: '0px',
            fontSize: '1.3em',
            textAlign: 'right',
            background: 'transparent'
        };

        vm.addressListStyle = {
            color: 'black',
            border: '2px solid black',
            backgroundColor: 'white',
            width: 'vm.windowWidth',
            fontSize: '0.9em'
        };

        vm.addressClick = function(address) {
            vm.showAddresses = false;//hide the displayed addresses
            vm.address = address.description; //put the clicked address in the searchbar
            searchbar.getAddressDetails(address.place_id)
            .then(function(data) {
                vm.location.latitude = data.geometry.location.k;
                vm.location.longitude = data.geometry.location.B;
            }, function() {
            });
        };
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};