StartTest(function(t) {
 
    t.ok(views.MainView, 'views');
	t.isNot(AnalyticsApp.views, AnalyticsApp.stores, 'mainview test');
    /*t.requireOk('Ext.regModel', function() {
        var mod = Ext.create('Ext.regModel', {
            id : 42, 
            title : 'test title', 
            desc : 'test desc'
        });
        t.is(mod.get('id'), 42 'Could read id');
		t.is(mod.get('title'), 'test title', 'Could read title');
		t.is(mod.get('desc'), 'test desc', 'Could read desc');
    }); */
});