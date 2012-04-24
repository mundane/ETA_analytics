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

		AnalyticsApp.views.analyticsGridView.Canvas.update(options.note.data);
        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.analyticsGridView,
            { type: 'slide', direction: 'left' }
        );
    },    

	'defaultview': function (options) {

      AnalyticsApp.views.mainView.setActiveItem(
      AnalyticsApp.views.defaultView,
            { type: 'slide', direction: 'left' }
        );
    },

	'importnote': function (options) {
		var currentNote = AnalyticsApp.views.noteEditorView.getRecord();

	},

	'savedata': function (optiona) {
		console.log('hej hej hej');
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

	'creategraph': function (options) {
		AnalyticsApp.views.analyticsGridView.Canvas.update("");
		var store1 = new Ext.data.JsonStore({
			fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
			data: [
			{'name':'metric one', 'data1':10, 'data2':12, 'data3':14, 'data4':8, 'data5':13},
			{'name':'metric two', 'data1':7, 'data2':8, 'data3':16, 'data4':10, 'data5':3},
			{'name':'metric three', 'data1':5, 'data2':2, 'data3':14, 'data4':12, 'data5':7},
			{'name':'metric four', 'data1':24, 'data2':14, 'data3':6, 'data4':1, 'data5':23},
			{'name':'metric five', 'data1':27, 'data2':38, 'data3':36, 'data4':13, 'data5':33}
			]
		});

		console.log("1");

		var chartpanel = new Ext.chart.Chart({
			renderTo:'canvas',
			width: 500,
			height: 300,
			id:'mychart',
			animate: true,
			store: store1,
			series: [{
				type: 'pie',
				angleField: 'data1',
				showInLegend: true,
				tips: {
					trackMouse: true,
					width: 140,
					height: 28,
					renderer: function(storeItem, item) {
						//calculate and display percentage on hover
						var total = 0;
						store.each(function(rec) {
							total += rec.get('data1');
						});
						this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
					}
				},
				highlight: {
					segment: {
						margin: 20
					}
				},
				label: {
					field: 'name',
					display: 'rotate',
					contrast: true,
					font: '18px Arial'
				}
			}]
		});

    },

    'canceledit': function (options) {

        AnalyticsApp.views.mainView.setActiveItem(
            AnalyticsApp.views.notesListView,
            { type: 'slide', direction: 'right' }
        );
    }
});

AnalyticsApp.controllers.analyticsController = Ext.ControllerManager.get('AnalyticsController');
