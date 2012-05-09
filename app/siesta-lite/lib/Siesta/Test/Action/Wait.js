/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Wait
@extends Siesta.Test.Action

This action can be included in the `t.chain` call with "wait" or "delay" shortcuts:

    t.chain(
        {
            action      : 'wait',   // or "delay"
            delay       : 1000      // 1 second
        }
    )

This action will just wait the time specified - 1s by default, and continue. 

*/
Class('Siesta.Test.Action.Wait', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        /**
         * @cfg {Number} delay
         * 
         * A number of milliseconds to wait before continuing.
         */
        delay  :        1000
    },

    
    methods : {
        
        process : function () {
            var originalSetTimeout      = this.test.originalSetTimeout
            
            originalSetTimeout(this.next, this.delay)
        }
    }
});


Siesta.Test.ActionRegistry.registerAction('wait', Siesta.Test.Action.Wait)
Siesta.Test.ActionRegistry.registerAction('delay', Siesta.Test.Action.Wait)