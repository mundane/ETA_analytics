var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title       : 'AnalyticsApp Test Suite',
	loaderPath  : { 'AnalyticsApp' : '..' },
	waitForAppReady: true,
    preload     : [

        'lib/touch/sencha-touch.css',
        'lib/touch/sencha-touch.js',
  		'app.css',
        'app.js', 
		"http://cdn.sencha.io/ext-4.0.7-gpl/resources/css/ext-all.css",
        "http://cdn.sencha.io/ext-4.0.7-gpl/ext-all-debug.js",
    ]
	
});

Harness.start(
    'test012_sanity.t.js',
    'test010_graphmodel.t.js'
);