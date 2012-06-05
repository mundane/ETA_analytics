AnalyticsApp.views.AnalyticsGridView = Ext.extend(Ext.Panel, {

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
            {
                xtype: 'spacer'
            },
            this.saveButton, this.trashButton]
        });

        this.Canvas = new Ext.Component({
            id: 'canvas',
            tpl: '<div class="anan"><h2>Data title: {title}</h2><tpl for="rows"><div> {row} </div></tpl></div>'
        });

        this.Sidebar = new Ext.Panel({
            dock: 'left',
            width: '70',
            layout: 'fit',
            items: [{
                xtype: 'list',
                id: 'Sidebarmenu',
                store: AnalyticsApp.stores.graphStore,
                listeners: {
                    selectionchange: this.menuButtonTap
                },
                itemTpl: '<img src="{icon}" width="48" height="48"/>'
            }],
            scope: this
        });

        this.dockedItems = [this.topToolbar, this.Sidebar, this.Canvas];
        AnalyticsApp.views.AnalyticsGridView.superclass.initComponent.call(this);

    },

	
    backButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'index'
        });
    },

    saveButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsGraphController,
            action: 'saveImage'
        });
    },

    menuButtonTap: function (model, records) {
        if (records[0]) {
            Ext.dispatch({
                controller: AnalyticsApp.controllers.analyticsGraphController,
                action: records[0].data.title.toLowerCase()
            });
        }
    },

    trashButtonTap: function () {
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'deletenote',
			id: $('.analytic_record').attr('id')
        });

    }


});