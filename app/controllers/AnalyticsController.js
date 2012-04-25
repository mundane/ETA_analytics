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

	'Pie': function (options) {
		AnalyticsApp.views.analyticsGridView.Canvas.update("");
		generateData = function(n, floor) {
            var data = [],
                p = (Math.random() * 11) + 1,
                i;

            floor = (!floor && floor !== 0) ? 20 : floor;

            for (i = 0; i < (n || 12); i++) {
                data.push({
                    name: Date.monthNames[i % 12],
                    2007: Math.floor(Math.max((Math.random() * 100), floor))
                });
            }
            return data;
        };
        var store1 = new Ext.data.JsonStore({
            fields: ['name', '2007'],
            data: generateData(6, 2)
        });
        		
		var chartPanel = new Ext.chart.Panel({
			renderTo:'canvas',
			title: 'Pie Chart',
			width: 1200,
			height: 600,
			id:'mychart',
			animate: true,
			store: store1,
			items: {
                cls: 'pie1',
                store: store1,
                theme: 'Demo',
                shadow: false,
                animate: true,
                insetPadding: 20,
                legend: {
                    position: {
                        portrait: 'bottom',
                        landscape: 'right'
                    }
                },
                interactions: [{
                    type: 'reset',
                    confirm: true
                },
                {
                    type: 'rotate'
                },
                {
                    type: 'iteminfo',
                    gesture: 'taphold',
                    listeners: {
                        show: function(interaction, item, panel) {
                            var storeItem = item.storeItem;
                            panel.update(['<ul><li><b>Month: </b>' + storeItem.get('name') + '</li>', '<li><b>Value: </b> ' + storeItem.get('2007') + '</li></ul>'].join(''));
                        }
                    }
                },
                {
                    type: 'piegrouping',
                    //snapWhileDragging: true,
                    onSelectionChange: function(me, items) {
                        if (items.length) {
                            var sum = 0,
                                i = items.length;
                            while(i--) {
                                sum += items[i].storeItem.get('2007');
                            }
                            chartPanel.descriptionPanel.setTitle('Total: ' + sum);
                            chartPanel.headerPanel.setActiveItem(1, {
                                type: 'slide',
                                direction: 'left'
                            });
                        }
                        else {
                            chartPanel.headerPanel.setActiveItem(0, {
                                type: 'slide',
                                direction: 'right'
                            });
                        }
                    }
                }],
                series: [{
                    type: 'pie',
                    field: '2007',
                    showInLegend: true,
                    highlight: false,
                    listeners: {
                        'labelOverflow': function(label, item) {
                            item.useCallout = true;
                        }
                    },
                    // Example to return as soon as styling arrives for callouts
                    callouts: {
                        renderer: function(callout, storeItem) {
                            callout.label.setAttributes({
                                text: storeItem.get('name')
                            }, true);
                        },
                        filter: function() {
                            return false;
                        },
                        box: {
                          //no config here.
                        },
                        lines: {
                            'stroke-width': 2,
                            offsetFromViz: 20
                        },
                        label: {
                           font: 'italic 14px Arial'
                        },
                        styles: {
                            font: '14px Arial'
                        }
                    },
                    label: {
                        field: 'name'
                    }
                }]
            }
		 
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
