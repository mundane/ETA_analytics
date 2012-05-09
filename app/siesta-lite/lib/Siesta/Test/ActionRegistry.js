/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.Action

*/
Class('Siesta.Test.ActionRegistry', {
    
    my : {
    
        has : {
            actionClasses       : Joose.I.Object
        },
    
        
        methods : {
            
            registerAction : function (name, constructor) {
                this.actionClasses[ name.toLowerCase() ] = constructor
            },

            
            getActionClass : function (name) {
                return this.actionClasses[ name.toLowerCase() ]
            },
            
            
            create : function (obj) {
                if (!obj.action) throw "Need to pass `action` property for step config"
                
                var actionClass = this.getActionClass(obj.action)
                
                return new actionClass(obj)
            }
        }
    }
});
