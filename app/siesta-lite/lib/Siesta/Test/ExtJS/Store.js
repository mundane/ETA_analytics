/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Store

This is a mixin, with helper methods for testing functionality relating to Ext.data.Store class. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.Store', {
    
    methods : {
        
        /**
         * Waits until all the passed stores have been loaded (fires the "load" event) and calls the provided callback.
         * 
         * This method accepts either variable number of arguments:
         *
         *      t.waitForStoresToLoad(store1, store2, function () { ... })
         * or array of stores:
         * 
         *      t.waitForStoresToLoad([ store1, store2 ], function () { ... })
         * 
         * @param {Ext.data.AbstractStore} store1 The store to load.
         * @param {Ext.data.AbstractStore} store2 The store to load.
         * @param {Ext.data.AbstractStore} storeN The store to load.
         * @param {Function} callback A function to call when the condition has been met.
         */        
        waitForStoresToLoad: function () {
            var Ext         = this.getExt();
            var args        = Ext.Array.flatten(Array.prototype.slice.call(arguments))
            
            var callback
            
            if (this.typeOf(args[ args.length - 1 ]) == 'Function') callback = args.pop()

            var me          = this;
            var loaded      = 0;
            var storesNum   = args.length;

            var async       = this.beginAsync();

            Joose.A.each(args, function (store) {
                if (!store.proxy) {
                    storesNum--;
                    return;
                }

                store.on('load', function () {

                    store.proxy.un('exception', exceptionFailure);

                    if (++loaded == storesNum) {
                        me.pass("All stores loaded correctly");

                        callback.apply(me, args);

                        me.endAsync(async);
                    }
                }, null, { single : true });

                var exceptionFailure = function () {
                    me.endAsync(async);
                    
                    me.fail("Failed to load the store", "Store [READ] URL: " + store.proxy.url);
                };

                store.proxy.on('exception', exceptionFailure);
            });
        },

        /**
         * This method is a wrapper around {@link #waitForStoresToLoad} method - it waits for the provided stores to fire the "load" event.
         * In addition to {@link #waitForStoresToLoad} this method also calls the `load` method of each passed store.
         * 
         * This method accepts either variable number of arguments:
         *
         *      t.loadStoresAndThen(store1, store2, function () { ... })
         * or array of stores:
         * 
         *      t.loadStoresAndThen([ store1, store2 ], function () { ... })
         * 
         * @param {Ext.data.AbstractStore} store1 The store to load.
         * @param {Ext.data.AbstractStore} store2 The store to load.
         * @param {Ext.data.AbstractStore} storeN The store to load.
         * @param {Function} callback A function to call when the condition has been met.
         */  
        loadStoresAndThen: function () {
            var Ext = this.getExt();
            this.waitForStoresToLoad.apply(this, arguments);
            
            var args                = Ext.Array.flatten(Array.prototype.slice.call(arguments))
            
            if (this.typeOf(args[ args.length - 1 ]) == 'Function') args.pop()

            Joose.A.each(args, function (store) {
                if (store.proxy && store.load) {
                    store.load();
                }
            });
        }
    }
});
