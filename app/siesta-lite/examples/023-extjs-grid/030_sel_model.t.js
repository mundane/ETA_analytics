StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    // Use a convenience method to generate the grid, keeping the test as small as possible
    var grid = t.getGrid({
        renderTo : document.body
    });
     
    var view = grid.getView(),
        store = grid.store,
        selModel = grid.getSelectionModel();

    var btn = new Ext.Button({
        text : 'Add new record',
        renderTo : Ext.getBody(),
        handler : function() { 
            store.add(Ext.create(store.model, {
                name : 'foo'
            }));  
        }
    });
   
    // First wait until rows are present in the DOM
    t.waitForRowsVisible(grid, function() {

        t.is(selModel.getCount(), 0, 'No records selected');

        t.click(t.getFirstRow(grid), function() {
        
            t.is(selModel.getCount(), 1, '1 record selected after click on row');

            // Clicking a component
            t.click(btn, function() {
                t.ok(selModel.isSelected(0), 'First record still selected after adding another record');
                
                view.el.on('keypress', function(e, t) {
                    if (e.getKey() === e.DELETE) {
                        store.remove(selModel.getLastSelected());
                    }
                });
                t.keyPress(t.getFirstRow(grid), 'DELETE');

                t.is(store.getCount(), 1, 'Store has one record after clicking button');

                t.click(t.getFirstRow(grid), function() {
                    t.keyPress(t.getFirstRow(grid), 'DELETE');

                    t.is(store.getCount(), 0, 'Store has no records after remove');
                    t.ok(!view.el.down('tr'), 'Grid view contains no row elements');
                });
            });
        });
    });
});
