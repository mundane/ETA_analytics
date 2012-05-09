StartTest(function(t) {
    t.requireOk(
        [
         'AnalyticsApp.models.AnalyticsModel', 
         'AnalyticsApp.views.DefaultView1'
         ], 
        function() {
            var record = Ext.create('AnalyticsApp.models.AnalyticsModel', {
                id : 100, 
                date : 23-04-12, 
                title : 'test title',
				narrative : 'some string'
            });
    t.ok(Ext, 'Ext is here');
            var window = Ext.create('AnalyticsApp.views.DefaultView1', {
            });

//            window.show();
            
//            window.down('form').loadRecord(record);

            t.is(window.query('button').length, 2, 'Found save and cancel buttons');
            t.is(window.query('field').length, 3, 'Found three fields as expected');

            t.hasValue(window.down('field[name=id]'), 100, 'ID ok');
            t.hasValue(window.down('field[name=date]'), 23-04-12, 'date ok');
            t.hasValue(window.down('field[name=title]'), 'test title', 'title ok');

//            t.willFireNTimes(window, 'destroy', 1);
        }
    );
});