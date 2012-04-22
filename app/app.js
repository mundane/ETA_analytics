var App = new Ext.Application({
    name: 'AnalyticsApp',
    useLoadMask: true,

    launch: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.notesController,
            action: 'index'
        });
    }
});