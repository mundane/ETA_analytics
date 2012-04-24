AnalyticsApp.views.NotesListView = Ext.extend(Ext.Panel, {

    analyticsStore: Ext.emptyFn,
    notesList: Ext.emptyFn,

    layout: 'fit',

    initComponent: function () {

        this.newButton = new Ext.Button({
            text: 'New',
            ui: 'action',
            handler: this.onNewNote,
            scope: this
        });

        this.importButton = new Ext.Button({
            text: 'Import',
            ui: 'action',
            handler: this.onImport,
            scope: this
        });

        this.topToolbar = new Ext.Toolbar({
            title: 'My Analytics',
            items: [
                { xtype: 'spacer' },
                this.newButton,
				this.importButton
            ]
        });

        this.dockedItems = [this.topToolbar];

        this.notesList = new Ext.List({
            store: this.analyticsStore,
            grouped: true,
			indexBar: true,
			emptyText: '<div style="margin:5px;">No notes cached.</div>',
            onItemDisclosure: true,
            itemTpl: '<div class="list-item-title">{title}</div>'
        });

        this.notesList.on('disclose', function (record, index, evt) {
            this.onEditNote(record, index);
        }, this);

        this.items = [this.notesList];

        AnalyticsApp.views.NotesListView.superclass.initComponent.call(this);
    },

    onNewNote: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'newnote'
        });
    },

    onImport: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'import'
        });
    },


    onEditNote: function (record, index) {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'editnote',
			note: record
        });
    },

    refreshList: function () {
        this.notesList.refresh();
    }
});
