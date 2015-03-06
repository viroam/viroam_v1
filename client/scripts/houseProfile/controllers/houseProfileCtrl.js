'use strict';
var controllername = 'houseProfileCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var databroker = require('../../databroker')(app.name.split('.')[0]).name;
    var deps = ['$rootScope', databroker + '.apartments'];

    function controller($rootScope, apartments) {

        var vm = this;

        vm.windowHeight = $rootScope.windowHeight;
        vm.windowWidth = $rootScope.windowWidth;
        var houseIndex = 1000;

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
            width: vm.windowWidth / 8 + 'px'
        };

        vm.price = '180';

        vm.dateStyle = {
            width: 2 * vm.windowWidth / 5 + 'px',
            display: 'inline'
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
            apartments.createApartment(houseIndex, 20, 30, vm.startDate, vm.endDate, vm.price);
            houseIndex++;
        };
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};