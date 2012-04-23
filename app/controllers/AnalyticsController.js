Ext.regController('AnalyticsController', {

    'index': function (options) {

        if (!AnalyticsApp.views.mainView) {
            AnalyticsApp.views.mainView = new AnalyticsApp.views.MainView();
        }

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView
        );
    },

    'newnote': function (options) {

        var now = new Date();
        var noteId = now.getTime();
        var note = Ext.ModelMgr.create({ id: noteId, date: now, title: '', narrative: '' },
            'AnalyticsModel'
        );

        AnalyticsApp.views.noteEditorView.load(note);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.noteEditorView,
            { type: 'slide', direction: 'left' }
        );
    },

    'import': function (options) {
        var now = new Date();
        var noteId = now.getTime();
        var note = Ext.ModelMgr.create({ id: noteId, date: now, title: '', narrative: '' },
            'AnalyticsModel'
        );

        AnalyticsApp.views.analyticsImportView.load(note);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.analyticsImportView,
            { type: 'slide', direction: 'left' }
        );
	},

    'editnote': function (options) {

        AnalyticsApp.views.noteEditorView.load(options.note);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.noteEditorView,
            { type: 'slide', direction: 'left' }
        );
    },

	'importnote': function (options) {
		var currentNote = AnalyticsApp.views.noteEditorView.getRecord();

	},

	'savedata': function (optiona) {
		var currentNote = AnalyticsApp.views.analyticsImportView.getRecord();
		AnalyticsApp.views.analyticsImportView.updateRecord(currentNote);
		var jsonData = JSON.stringify(CSVToArray(currentNote.get('narrative')));
		currentNote.set('narrative', jsonData);

        var errors = currentNote.validate();
        if (!errors.isValid()) {
			currentNote.reject();
            Ext.Msg.alert('Wait!', errors.getByField('title')[0].message, Ext.emptyFn);
            return;
        }
        if (null == AnalyticsApp.stores.analyticsStore.findRecord('id', currentNote.data.id)) {
            AnalyticsApp.stores.analyticsStore.add(currentNote);
        } else {
             currentNote.setDirty();
        }

        AnalyticsApp.stores.analyticsStore.sync();

        AnalyticsApp.stores.analyticsStore.sort([{ property: 'date', direction: 'DESC'}]);

        AnalyticsApp.views.notesListView.refreshList();

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView,
            { type: 'slide', direction: 'right' }
        );

	},

    'savenote': function (options) {

        var currentNote = AnalyticsApp.views.noteEditorView.getRecord();

        AnalyticsApp.views.noteEditorView.updateRecord(currentNote);

        var errors = currentNote.validate();
        if (!errors.isValid()) {
			currentNote.reject();
            Ext.Msg.alert('Wait!', errors.getByField('title')[0].message, Ext.emptyFn);
            return;
        }

        if (null == AnalyticsApp.stores.analyticsStore.findRecord('id', currentNote.data.id)) {
            AnalyticsApp.stores.analyticsStore.add(currentNote);
        } else {
             currentNote.setDirty();
        }

        AnalyticsApp.stores.analyticsStore.sync();

        AnalyticsApp.stores.analyticsStore.sort([{ property: 'date', direction: 'DESC'}]);

        AnalyticsApp.views.notesListView.refreshList();

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView,
            { type: 'slide', direction: 'right' }
        );
    },

    'deletenote': function (options) {

        var currentNote = AnalyticsApp.views.noteEditorView.getRecord();

        if (AnalyticsApp.stores.analyticsStore.findRecord('id', currentNote.data.id)) {
            AnalyticsApp.stores.analyticsStore.remove(currentNote);
        }

        AnalyticsApp.stores.analyticsStore.sync();
        AnalyticsApp.views.notesListView.refreshList();

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView,
            { type: 'slide', direction: 'right' }
        );
    },

    'canceledit': function (options) {

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView,
            { type: 'slide', direction: 'right' }
        );
    }
});

AnalyticsApp.controllers.analyticsController = Ext.ControllerManager.get('AnalyticsController');