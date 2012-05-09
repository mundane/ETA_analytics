/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.FormField

This is a mixin, with helper methods for testing functionality relating to Ext.form.Field class. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.FormField', {
    
    methods : {
        /**
         * Passes if the passed Field has the expected value.
         * 
         * @param {Ext.Element} field The field
         * @param {Ext.util.Region} region The region to compare to.
         * @param {String} description The description of the assertion
         */
        hasValue : function(field, value, description) {
            this.is(field.getValue(), value, description);
        }
    }
});
