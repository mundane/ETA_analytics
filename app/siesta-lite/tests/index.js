var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title       : 'Siesta self-hosting test suite',
    
    testClass   : Class({
        
        isa     : Siesta.Test.ExtJS,
        
        does    : Siesta.Test.Self
    }),
    
    preload : [
        'http://cdn.sencha.io/ext-4.0.7-gpl/resources/css/ext-all.css',
        'http://cdn.sencha.io/ext-4.0.7-gpl/ext-all-debug.js',
        '../siesta-all.js',
        'lib/Siesta/Test/AssertionsTranslator.js',
        {
            // copy the feature test results from the harness
            text        : 'Siesta.supports = Ext.clone((window.opener || window.parent).Siesta.supports.results)'
        }
    ],
    
    overrideSetTimeout  : false
})


Harness.start(
    '010_sanity.t.js',
    '020_test.t.js',
    '021_assertions_1.t.js',
    '030_test_more.t.js',
    '031_test_more_chain.t.js',
    '040_keyevent_simulation.t.js',
    '041_keyevent_simulation2.t.js',
    '042_keyevent_simulation3.t.js',
    '043_special_keys.t.js',
    '201_function.t.js',
    {
        group               : 'Visual tests',
        
        items               : [
            '050_mouse_click.t.js',
            '050_mouse_click_jquery.t.js',
            '051_mouse_overout.t.js',
            '051_mouse_overout_with_span.t.js',
            '052_mouse_move.t.js',
            '060_element.t.js',
            '061_element_wait_for_selectors.t.js',
            '070_chaining_with_actions.t.js',
            '071_chain_click.t.js'
        ]
    },
    
    '100_util_queue.t.js',
    {
        url             : '110_util_serializer.t.js',
        // need to reach the "done" call, since in FF, serializing the `window.location` property
        // may cause a silent and undetectable exception
        needDone        : true
    },
    '120_util_xml_node.t.js',
    
    {
        group               : 'ExtJS related',
        
        items               : [
            '500_extjs_observable.t.js',
            {
                url         : '501_extjs_combo_autocomplete.t.js',
                speedRun    : false
            },
            '502_extjs_component.t.js',
            '502_extjs_wait_for_cq.t.js',
            '503_extjs_dataview.t.js',
            '504_extjs_element.t.js',
            '505_extjs_grid.t.js',
            '506_extjs_observable.t.js',
            '510_extjs_require_singleton.t.js',
            '520_extjs_dataview.t.js'
        ]
    }
)



