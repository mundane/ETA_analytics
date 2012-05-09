StartTest(function(t) {
    var store = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'bar'}
        ],
        data: [
            ['Foo']
        ]
    });

    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
            {
                text     : 'F',
                sortable : false,
                dataIndex: 'bar'
            }
        ],
        height: 100,
        width: 100,
        renderTo: Ext.getBody()
    });

    t.expectPass(function (t) {
        t.is(grid.getView().getNode(0), t.getFirstItem(grid.getView()), 'getFirstItem OK');
    })

    // waitForViewRendered
});