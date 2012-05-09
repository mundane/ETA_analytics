StartTest(function(t) {
    t.diag("Sanity");

    t.ok(Ext, 'Ext is here');
	t.ok(Ext.regModel, 'Ext Model');
    t.ok(Ext.regStore, 'Ext Store');
    t.ok(Ext.extend, 'Ext View');

    t.ok(AnalyticsApp, 'AnalyticsApp is here');
    t.ok(AnalyticsApp.views, 'AnalyticsApp Views');
	t.ok(AnalyticsApp.stores, 'AnalyticsApp Store');
	t.ok(AnalyticsApp.controllers, 'AnalyticsApp Controller');
	t.ok(AnalyticsApp.models, 'AnalyticsApp Model'); 
	
	t.requireOk('AnalyticsApp.controllers.analyticsController');
	t.requireOk('AnalyticsApp.views.NoteEditorView');
	t.requireOk('AnalyticsApp.views.AnalyticsImportView');
	t.requireOk('AnalyticsApp.views.DefaultView1');
	
	t.requireOk('AnalyticsApp.controllers.analyticsController');
	
	t.requireOk('AnalyticsApp.stores.analyticsStore');

	t.expectGlobals('Additional', 'Globals');
	
    t.done();   // Optional, marks the correct exit point from the test
}) 

