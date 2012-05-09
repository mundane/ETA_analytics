/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Observable

This is a mixin, with helper methods for testing functionality relating to Ext.util.Observable class. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.Observable', {
    
    methods : {
        
        /**
         * This assertion can be expressed as the following statement: When calling the passed 
         * function `func`, the passed `observable` will fire the `event` `n` times, during the
         * following `timeOut` milliseconds. 
         * 
         * @param {Ext.util.Observable} observable The observable instance  
         * @param {String} event The name of event
         * @param {Number} n The expected number of events
         * @param {Number} timeOut The number of milliseconds to wait for events to be fired
         * @param {Function} func The function which should fire the events to detect
         * @param {String} desc The description of the assertion.
         * @param {Function} callback Optional. A callback to call after the assertion was checked. 
         */
         firesOk: function (observable, event, n, timeOut, func, desc, callback) {
            var me      = this;
            var async   = this.beginAsync(timeOut + 100);
            
            var originalSetTimeout = this.originalSetTimeout;

            originalSetTimeout(function () {

                me.endAsync(async);

                observable.un(event, countFunc);

                if (counter == n)
                    me.pass('Exactly ' + n + " '" + event + "' events have been fired");
                else
                    me.fail(n + " '" + event + "' events were expected, but " + counter + ' were fired');

                callback && callback();

            }, timeOut);


            var counter = 0;

            var countFunc = function () { counter++; };

            observable.on(event, countFunc);

            func();
        },
        
        
        /**
         * This assertion passes if the observable fires the specified event exactly (n) times during the test execution.
         * 
         * @param {Ext.util.Observable} observable The observable instance  
         * @param {String} event The name of event
         * @param {Number} n The expected number of events to be fired
         * @param {String} desc The description of the assertion.
         */
        willFireNTimes: function (observable, event, n, desc, isGreaterEqual) {
            var me      = this;
            desc = desc ? (desc + ' ') : '';

            this.on('beforetestfinalizeearly', function () {
                observable.un(event, countFunc);

                if (counter === n || (isGreaterEqual && counter > n)) {
                    me.pass(desc + 'Exactly ' + n + " '" + event + "' events have been fired");
                } else {
                    me.fail(desc + n + " '" + event + "' events were expected, but " + counter + ' were fired');
                }
            });

            var counter = 0,
                countFunc = function () { counter++; };

            observable.on(event, countFunc);
        },

        /**
         * This assertion passes if the observable does not fire the specified event through the duration of the entire test.
         * 
         * @param {Ext.util.Observable} observable The observable instance  
         * @param {String} event The name of event
         * @param {String} desc The description of the assertion.
         */
        wontFire : function(observable, event, desc) {
            this.willFireNTimes(observable, event, 0, desc);
        },

        /**
         * This assertion passes if the observable does not fire the specified event through the duration of the entire test.
         * 
         * @param {Ext.util.Observable} observable The observable instance  
         * @param {String} event The name of event
         * @param {Number} n The minimum number of events to be fired
         * @param {String} desc The description of the assertion.
         */
        firesAtLeastNTimes : function(observable, event, n, desc) {
            this.willFireNTimes(observable, event, n, desc, true);
        },
        
        
        /**
         * This method will wait till the first `event`, fired on the provided `observable` and then will call the provided callback.
         * 
         * @param {Ext.util.Observable} observable The observable to wait on
         * @param {} event The name of the event to wait for
         * @param {} callback The callback to call 
         * @param {} scope The scope for the callback
         * @param {} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForEvent : function (observable, event, callback, scope, timeout) {
            var eventFired      = false
            
            observable.on(event, function () { eventFired = true }, null, { single : true })
            
            this.waitFor(
                function () { return eventFired },
                callback,
                scope,
                timeout
            );
        },
        
        
        /**
         * This method checks if the provided `observable` has a listener for the `eventName`
         * 
         * @param {Ext.util.Observable} observable
         * @param {} eventName
         */
        hasListener : function (observable, eventName, description) {
            if (!observable || !observable.hasListener) {
                this.fail(description, {
                    assertionName       : 'hasListener',
                    annotation          : '1st argument for `t.hasListener` should be an observable instance'
                })
                
                return
            }
            
            if (observable.hasListener(eventName))
                this.pass(description)
            else
                this.fail(description, {
                    assertionName       : 'hasListener',
                    annotation          : 'Provided observable has no listeners for event: ' + eventName
                })
        }
    }
});
