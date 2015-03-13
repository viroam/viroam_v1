'use strict';
 /*eslint consistent-this:[2,  "vrScrollViewCtrl"] */
var directivename = 'vrScrollView';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$famous'];
    var controller = function($famous) {
        var vrScrollViewCtrl = this;
        vrScrollViewCtrl.directivename = directivename;

        var EventHandler = $famous['famous/core/EventHandler'];
        vrScrollViewCtrl.myEventHandler = new EventHandler();

        vrScrollViewCtrl.videoScrollView = {
            options: {
                paginated: true,
                speedLimit: 5,
                direction: 1
            }
        };
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'AE',
            scope: {
                videos: '='
            },
            controller: controller,
            controllerAs: 'vrScrollViewCtrl',
            bindToController: true,
            template: require('./vrScrollView.html'),
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs) {

                    },
                    post: function(scope, element, attrs) {

                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
