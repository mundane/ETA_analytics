StartTest(function(t) {
    t.diag('Grid');
    
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
        deferRowRender : false,
        renderTo: Ext.getBody()
    });

    t.expectPass(function (t) {
        t.is(t.getFirstRow(grid), Ext.get(grid.getView().getNode(0)), 'getFirstRow OK');
        t.matchGridCellContent(grid, 0, 0, 'Foo', 'matchGridCellContent OK');
    });
    
    t.expectFail(function (t) {
        t.matchGridCellContent(grid, 0, 0, 'ASD', 'matchGridCellContent fails OK');
    });
});