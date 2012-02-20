var helloWorld = new Ext.Application({
    launch: function() {
        this.tabs = new Ext.TabPanel({
            fullscreen: true,
            dockedItems: [{xtype:'toolbar', title:'ETA'}],
            tabBar: {
                ui: 'light',
                layout: {
                    pack: 'center'
                }
            },
            items: [
                {cls:'hello', title:'Hello'},
                {cls:'world', title:'World'}
            ]
        });
    }
});
