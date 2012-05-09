StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    // Use a convenience method to generate the grid, keeping the test as small as possible
    var grid = t.getGrid({
        plugins : Ext.create("Ext.grid.plugin.CellEditing", {}),
        renderTo : document.body
    });
     
    var store = grid.store;

    t.waitForRowsVisible(grid, function() {
        var firstCell = t.getFirstCell(grid);

        // See if we can edit the name cell
        t.doubleClick(firstCell, function() {
            
            var prevValue       = store.first().get('name');
            
            // Wait for editor to appear at the position of the cell
            t.waitForSelectorAt(firstCell.getXY(), 'input', function(foundEl) {
                // Clear text field
                foundEl.value = '';

                // Type some text
                t.type(foundEl, 'foo[ENTER]', function() {
                        
                    t.is(store.first().get('name'), 'foo', 'Name was updated correctly');
    
                    var dateCell = t.getCell(grid, 0, 3);
                        
                    // See if we can edit the "last game" cell
                    t.doubleClick(dateCell, function() {
                        // Date value is "11/12/2010", change to "01/12/2010"
                        t.waitForSelectorAt(dateCell.getXY(), 'input', function(foundEl) {
                            foundEl.value = ''; // Reset field
                            t.type(foundEl, '01/18/2009[ENTER]', function() {
                                t.isDateEqual(store.first().get('lastgame'), new Date(2009, 0, 18), 'Date was updated correctly');
                            });
                        });
                    });
                });
                // eof waitFor
            });
            // eof waitForSelectorAt
        });
        // eof doubleClick
    });
    // eof waitForRowsVisible
});
