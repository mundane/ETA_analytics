var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title       : 'All-in-one Siesta Examples for Desktops',
    
    viewDOM     : true
});

Harness.start(
    {
        group       : 'Basics',
        autoCheckGlobals : true,
        
        testClass   : Siesta.Test.Browser,
        
        items       : [
            '010-basics/010_basic_assertions.t.js',
            '010-basics/020_async_code.t.js',
            
            // and object with `url` property and its own "preload" option
            {
                url : '010-basics/030_global_variables.t.js',
                name : 'Global variables',  // You can also use the name config if your urls are hard to read
                preload : [
                    // Jquery CDN
                    'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.4.min.js'
                ]
            }
        ]
    },
    
    {
        group       : 'Generic browser tests',
        
        testClass   : Siesta.Test.Browser,
        
        items       : [
            '011-basic-browser/010_text_selection.t.js'
        ]
    },
    
    // sencha examples
    {
        group       : 'Sencha Ext JS examples',
        
        testClass   : Siesta.Test.ExtJS,
        preload : [
            "http://cdn.sencha.io/ext-4.0.7-gpl/resources/css/ext-all.css",
            "http://cdn.sencha.io/ext-4.0.7-gpl/ext-all-debug.js"
        ],

        items       : [
            {
                group       : 'General',
                
                items       : [
                    '020-extjs-general/010_ext-bug.t.js',
                    '020-extjs-general/015_ext-combo.t.js',
                    {
                        url : '020-extjs-general/020_ext-custom-combo.t.js',
                        useStrictMode   : false,        // You can also use quirks mode for tests
                        alsoPreload : [
                            'http://cdn.sencha.io/ext-4.0.7-gpl/examples/form/forum-search.js'
                        ]
                    },
                    {
                        url : '020-extjs-general/030_ext-resize.t.js',
                        alsoPreload : [
                            'http://cdn.sencha.io/ext-4.0.7-gpl/examples/draw/Sencha.js'
                        ]
                    },
                    '020-extjs-general/040_ext-window.t.js'
                ]
            },
            {
                group       : 'Basic drag drop',
        
                items       : [
                    {
                        // Specify your own HTML page if you want
                        hostPageUrl     : '021-extjs-drag-drop/cats.html',
                        url             : '021-extjs-drag-drop/010_drag-drop.t.js',
                        preload         : []
                    },
                    '021-extjs-drag-drop/020_dd-tree.t.js'
                ]
            },
            {
                group       : 'Forms',
        
                items       : [
                    '022-extjs-form/010_basic_form.t.js',
                    '022-extjs-form/020_checkboxes.t.js'
                ]
            },
            {
                group       : 'Grid',
                
                testClass : Your.Test.Class,
        
                items       : [
                    '023-extjs-grid/010_basic.t.js',
                    '023-extjs-grid/020_mouseover.t.js',
                    '023-extjs-grid/030_sel_model.t.js',
                    '023-extjs-grid/040_editing.t.js',
                    '023-extjs-grid/050_resizing.t.js'
                ]
            },
            {
                group       : 'MVC',  
                loaderPath  : { 'AM' : '025-extjs-mvc/app'},
                items               : [
                    {
                        group               : 'Sanity',
                        items               : [
                            '025-extjs-mvc/tests/010_sanity.t.js'
                        ]
                    },
                    {
                        group               : 'Model',
                        items               : [
                            '025-extjs-mvc/tests/011_usermodel.t.js'
                        ]
                    },
                    {
                        group               : 'Application',
                        loaderPath          : { 'AM' : 'app' },
                        // need to set the `preload` to empty array - to avoid the double loading of dependencies
                        preload             : [],
                        items : [
                            {
                                hostPageUrl         : '025-extjs-mvc/app.html',
                                url                 : '025-extjs-mvc/tests/014_app.t.js'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // eof sencha examples
    
    {
        group       : 'jQuery',
        testClass   : Siesta.Test.jQuery,
        
        preload : [
            // Jquery CDN
            'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.4.min.js'
        ],
        
        items       : [
            '040-jquery/010_hello_world.t.js',
            {
                hostPageUrl : '040-jquery/020_jquery_ui.html',
                
                alsoPreload         : [
                    'http://ajax.microsoft.com/ajax/jquery.ui/1.8.16/jquery-ui.js',
                    'http://ajax.microsoft.com/ajax/jquery.ui/1.8.16/themes/black-tie/jquery-ui.css'
                ],
                url : '040-jquery/020_jquery_ui_selectable.t.js'
            },
            {
                url : '040-jquery/030_monkey.t.js'
            }
        ]
    },
    {
        group       : 'PrototypeJS',
        
        testClass   : Siesta.Test.Browser,
        
        preload : [
            "050-prototypejs/prototype.js"
        ],
        items       : [
            '050-prototypejs/hello_world.t.js'
        ]
    }
);
// eof Harness.start