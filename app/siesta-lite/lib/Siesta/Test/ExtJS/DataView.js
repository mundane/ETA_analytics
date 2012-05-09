/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.DataView

This is a mixin, with helper methods for testing functionality relating to ExtJS dataviews. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.DataView', {
    
    requires        : [ 'waitFor', 'getExt' ],
    
    
    methods : {
        /**
         * Waits for the items of a dataview to render and then calls the supplied callback.
         * @param {Ext.view.View} view The view
         * @param {Function} callback A function to call when the condition has been met.
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */
        waitForViewRendered : function(view, callback, scope, timeout) {
            var hasItems    = view.store.getCount() > 0

            this.waitFor(
                function() { return hasItems ? !!view.getNode(0) : view.rendered }, 
                callback,
                scope, 
                timeout
            );
        },

        /**
         * Utility method which returns the first view element.
         * 
         * @param {Ext.panel.Table} panel The panel
         * @return {Ext.Element} The first element of the view
         */
        getFirstItem : function(view) {
            var Ext = this.getExt();
            return Ext.get(view.getNode(0));
        }
    }
});
