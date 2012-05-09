/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.DoubleClick
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action will perform a {@link Siesta.Test.Browser#doubleClick double click} on the provided {@link #target}. 
Target can be a DOM element or, in case you are using the Siesta.Test.ExtJS class - an instance of Ext.Component 

This action can be included in the `t.chain` call with "doubleclick" or "doubleClick" shortcuts:

    t.chain(
        {
            action      : 'click',
            target      : someDOMElement
        }
    )


*/
Class('Siesta.Test.Action.DoubleClick', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'doubleClick'
    },

    
    methods : {
        
        process : function () {
            this.test.rightClick(this.getTarget(), this.next)
        }
    }
});


Siesta.Test.ActionRegistry.registerAction('doubleclick', Siesta.Test.Action.DoubleClick)
