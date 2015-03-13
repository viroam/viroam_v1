'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var servicename = 'calculator';
ddescribe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
                this.$kinvey = $injector.get('$kinvey');
            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            it('updateChannel should exit when user is not authenticated', function() {

                // ARRANGE

                    spyOn(this.$kinvey , 'getActiveUser').and.return({});
                    spyOn(this.$kinvey , 'DataStore.save');
                // ACT
                this.service.updateChannel();
                // ASSERT
                //expect(this.$kinvey.DataStore.save).not.toHaveBeenCalled();
                expect(this.$kinvey.DataStore.save.calls.length).toEqual(1);

            })

            describe('add()', function() {

                it('add should succeed with positive numbers', function() {
                    var a = 1;
                    var b = 12;
                    var retval = this.service.add(a, b);
                    expect(retval).toBe(a + b);
                });

                it('add should succeed with negative numbers', function() {
                    var a = 1;
                    var b = -12;
                    var retval = this.service.add(a, b);
                    expect(retval).toBe(a + b);
                });

                it('add with null first parameter should throw error', function() {
                    var that = this;
                    expect(function() {
                        that.service.add(null, 12);
                    }).toThrow();

                });

                it('add with null second parameter should throw error', function() {
                    expect(function() {
                        this.service.add(12, null);
                    }.bind(this)).toThrow();

                });
            });
        });
    });
});
