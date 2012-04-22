AnalyticsApp.views.MainView = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    cardSwitchAnimation: 'slide',
    initComponent: function () {

        Ext.apply(AnalyticsApp.views, {
            notesListView: new AnalyticsApp.views.NotesListView({ analyticsStore: AnalyticsApp.stores.analyticsStore }),
            noteEditorView: new AnalyticsApp.views.NoteEditorView()
        });

        this.items = [
            AnalyticsApp.views.notesListView,
            AnalyticsApp.views.noteEditorView
        ];

        AnalyticsApp.views.MainView.superclass.initComponent.call(this);

        this.on('render', function () {
            AnalyticsApp.stores.analyticsStore.load();
        });
    }
});