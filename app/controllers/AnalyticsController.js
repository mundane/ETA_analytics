Ext.regController('AnalyticsController', {

    'index': function (options) {
		"use strict";
        if (!AnalyticsApp.views.mainView) {
            AnalyticsApp.views.mainView = new AnalyticsApp.views.MainView();
        }

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView
        );
    },

    'newnote': function (options) {
		"use strict";
        var now = new Date(), noteId = now.getTime();
        var note = Ext.ModelMgr.create(
			{ id: noteId, date: now, title: '', narrative: '' },
            'AnalyticsModel'
		);

        AnalyticsApp.views.noteEditorView.load(note);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.noteEditorView,
            { type: 'slide', direction: 'left' }
		);
    },

    'import': function (options) {
		"use strict";
        var now = new Date(), noteId = now.getTime();
        var note = Ext.ModelMgr.create(
			{ id: noteId, date: now, title: '', narrative: '' },
            'AnalyticsModel'
        );

        AnalyticsApp.views.analyticsImportView.load(note);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.analyticsImportView,
            { type: 'slide', direction: 'left' }
        );
	},

    'editnote': function (options) {
		"use strict";
		AnalyticsApp.views.analyticsGridView.Canvas.update(options.note.data);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.analyticsGridView,
            { type: 'slide', direction: 'left' }
        );
    },

	'defaultview': function (options) {
		"use strict";
		AnalyticsApp.views.mainView.setActiveItem(
			AnalyticsApp.views.defaultView,
			{ type: 'slide', direction: 'left' }
        );
    },

	'importnote': function (options) {
		"use strict";
		var currentNote = AnalyticsApp.views.noteEditorView.getRecord();

	},


   'browsecsv': function (options) {
	AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.analyticsBrowserView,
            { type: 'slide', direction: 'left' }
        );
    },

	'savedata': function (options) {
		"use strict";
		var currentNote = AnalyticsApp.views.analyticsImportView.getRecord(), jsonData, errors;
		AnalyticsApp.views.analyticsImportView.updateRecord(currentNote);
		jsonData = new JSON.stringify(new CSVToArray(currentNote.get('narrative')));
		currentNote.set('narrative', jsonData);

        errors = currentNote.validate();
        if (!errors.isValid()) {
			currentNote.reject();
            Ext.Msg.alert('Wait!', errors.getByField('title')[0].message, Ext.emptyFn);
            return;
        }
        if (null === AnalyticsApp.stores.analyticsStore.findRecord('id', currentNote.data.id)) {
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
		"use strict";
        var currentNote = AnalyticsApp.views.noteEditorView.getRecord(), errors;

        AnalyticsApp.views.noteEditorView.updateRecord(currentNote);

		errors = currentNote.validate();
        if (!errors.isValid()) {
			currentNote.reject();
            Ext.Msg.alert('Wait!', errors.getByField('title')[0].message, Ext.emptyFn);
            return;
        }

        if (null === AnalyticsApp.stores.analyticsStore.findRecord('id', currentNote.data.id)) {
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
		"use strict";
		var currentNote;
        if (currentNote = AnalyticsApp.stores.analyticsStore.findRecord('id', options.id)) {
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
		"use strict";
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView,
            { type: 'slide', direction: 'right' }
        );
    }
});

AnalyticsApp.controllers.analyticsController = Ext.ControllerManager.get('AnalyticsController');
