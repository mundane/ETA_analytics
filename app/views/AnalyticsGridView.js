﻿AnalyticsApp.views.AnalyticsGridView = Ext.extend(Ext.Panel, {

	layout: 'card',

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
            title: 'Graph Note',
            items: [
                this.backButton,
                { xtype: 'spacer' },
                this.saveButton,
                this.trashButton
            ]
        });

		this.Canvas = new Ext.Component ({
			tpl: '<div id="record-{id}">{narrative}</div>'
		});

		this.Sidebar = new Ext.Panel({
            dock: 'left',
            width: '70',
            layout: 'fit',
            items:[{
				xtype: 'list',
				id:'Sidebarmenu',
				store: AnalyticsApp.stores.graphStore,
				itemTpl: '<div>{title}</div>'
			}],
			scope: this
        });

		this.dockedItems = [this.topToolbar,this.Sidebar,this.Canvas];
		AnalyticsApp.views.AnalyticsGridView.superclass.initComponent.call(this);

     },
   backButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'index'
        });
    },

    trashButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'deletenote'
        });
    }

});
