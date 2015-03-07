'use strict';
 /*eslint consistent-this:[2,  "secureCtrl"] */
var directivename = 'secure';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$state', '$rootScope'];
    var controller = function($state, $rootScope) {
        var secureCtrl = this;
        var initialised=false;
        $rootScope.$on('$stateChangeStart', function(e, toState){
            if(!initialised){
                initialised=true;
                e.preventDefault();
                $state.go('login');
            }
        });

        secureCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;
    
    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'A',
            scope: {
            },
            controller: controller,
            controllerAs: 'secureCtrl',
            bindToController: true,
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
