/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.Model.Assertion', {

    extend      : 'Ext.data.Model',

    idProperty  : 'index',

    fields      : [
        'index', 
        'passed',
        'isTodo',
        'description',
        'annotation',
        'type',
    
        // For logging simulated events (will also have a type as for diagnostic messages)
        { name : 'isSimulatedEvent', type : 'boolean', defaultValue : false },
        'eventType'
    ]
})
