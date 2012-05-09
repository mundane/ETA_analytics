var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title     : 'Awesome Test Suite',
    
    testClass : Your.Test.Class,
    
    preload : [
        "http://cdn.sencha.io/ext-4.0.7-gpl/resources/css/ext-all.css",
        "http://cdn.sencha.io/ext-4.0.7-gpl/ext-all-debug.js"
    ]
});


Harness.start(
    {
        group       : 'Basic grid features',
        
        items       : [
            '010_basic.t.js'
        ]
    },
    {
        group       : 'Grid and mouseover',
        
        items       : [
            '020_mouseover.t.js'
        ]
    },
    {
        group       : 'Grid selection model',
        
        items       : [
            '030_sel_model.t.js'
        ]
    },
    {
        group       : 'Editing',

        items : [
            '040_editing.t.js'
        ] 
    },
    {
        group       : 'Resizing',

        items : [
            '050_resizing.t.js'
        ] 
    }
);

