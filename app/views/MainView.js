AnalyticsApp.views.MainView = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    cardSwitchAnimation: 'slide',
    initComponent: function () {

        Ext.apply(AnalyticsApp.views, {
            notesListView: new AnalyticsApp.views.NotesListView({ analyticsStore: AnalyticsApp.stores.analyticsStore }),
            noteEditorView: new AnalyticsApp.views.NoteEditorView(),
            analyticsImportView: new AnalyticsApp.views.AnalyticsImportView(),
            analyticsGridView: new AnalyticsApp.views.AnalyticsGridView()
        });

        this.items = [
            AnalyticsApp.views.notesListView,
            AnalyticsApp.views.noteEditorView,
            AnalyticsApp.views.analyticsImportView,
            AnalyticsApp.views.analyticsGridView
        ];

        AnalyticsApp.views.MainView.superclass.initComponent.call(this);

        this.on('render', function () {
            AnalyticsApp.stores.analyticsStore.load();
        });
    }
});
