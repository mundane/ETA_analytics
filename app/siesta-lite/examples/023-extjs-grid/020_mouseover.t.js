StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    // Use a convenience method to generate the grid, keeping the test as small as possible
    var grid = t.getGrid({
        width : 400,
        renderTo : document.body
    });

    var view = grid.getView(),
        store = grid.store,
        selModel = grid.getSelectionModel();
   
    // First wait until rows are present in the DOM
    t.waitForRowsVisible(grid, function() {
        var firstRowEl = t.getFirstRow(grid),
            headerEl = grid.headerCt.items.first().el;
           
        t.hasNotCls(firstRowEl, "x-grid-row-over", 'Row does not have mouseover class by default');
        
        t.mouseOver(t.getFirstRow(grid));
        
        t.hasCls(firstRowEl, "x-grid-row-over", 'Row has mouseover class');
        
        t.mouseOut(t.getFirstRow(grid));
        
        t.hasNotCls(firstRowEl, "x-grid-row-over", 'Row does not have mouseover after mouseout');
        
        t.willFireNTimes(grid.headerCt, 'headerclick', 4);
        
        t.moveMouseTo(headerEl, function() {
            t.diag('Make sure hover classes on grid headers work correctly');
            t.selectorIsAt('.x-column-header-over', t.currentPosition, 'Cell has over class applied to it #1');
            t.click();
            
            headerEl = headerEl.next();
            t.moveMouseTo(headerEl, function() {
                
                t.selectorIsAt('.x-column-header-over', t.currentPosition, 'Cell has over class applied to it #2');
                t.click();

                headerEl = headerEl.next();
                t.moveMouseTo(headerEl, function() {
                    t.selectorIsAt('.x-column-header-over', t.currentPosition, 'Cell has over class applied to it #3');
                    t.click();
                    
                    headerEl = headerEl.next();
                    t.moveMouseTo(headerEl, function() {
                        t.selectorIsAt('.x-column-header-over', t.currentPosition, 'Cell has over class applied to it #4');
                        t.click();
                        
                        t.moveMouseTo([500, 110], function() {
                            t.is(Ext.select('.x-column-header-over').getCount(), 0, 'No header cells in hover over state');
                        });
                    });
                });
            });
        });
    });
});
