﻿AnalyticsApp.views.NoteEditorView = Ext.extend(Ext.form.FormPanel, {

    initComponent: function () {

        this.backButton = new Ext.Button({
            text: 'Home',
            ui: 'back',
            handler: this.backButtonTap,
            scope: this
        });

        this.saveButton = new Ext.Button({
            text: 'Save',
            ui: 'action',
            handler: this.saveButtonTap,
            scope: this
        });

        this.trashButton = new Ext.Button({
            iconCls: 'trash',
            iconMask: true,
            handler: this.trashButtonTap,
            scope: this
        });

        this.topToolbar = new Ext.Toolbar({
            title: 'Edit Note',
            items: [
                this.backButton,
                { xtype: 'spacer' },
                this.saveButton
            ]
        });

        this.bottomToolbar = new Ext.Toolbar({
            dock: 'bottom',
            items: [
                { xtype: 'spacer' },
                this.trashButton
            ]
        });

        this.dockedItems = [this.topToolbar, this.bottomToolbar];

        AnalyticsApp.views.NoteEditorView.superclass.initComponent.call(this);
    },

    backButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'canceledit'
        });
    },

    saveButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'savenote'
        });
    },
	importCSVButtonTap : function() {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'importnote'
        });
	},

    trashButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'deletenote'
        });
    },
	items: [{
        xtype: 'textfield',
        name: 'title',
        label: 'Title',
        required: true
    }, {
        xtype: 'textareafield',
        name: 'narrative',
        label: 'Data'
    }]
});
