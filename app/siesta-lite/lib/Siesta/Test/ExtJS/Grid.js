/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Grid

This is a mixin, with helper methods for testing functionality relating to ExtJS grids. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.Grid', {
    
    requires        : [ 'waitFor', 'pass', 'fail', 'typeOf' ],
    
    
    methods : {
        /**
         * Waits for the rows of a gridpanel or tree panel to render and then calls the supplied callback. Please note, that if the store of the grid has no records,
         * the condition for this waiter will never be fullfilled.
         * 
         * @param {Ext.panel.Table} panel The table panel
         * @param {Function} callback A function to call when the condition has been met.
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */
        waitForRowsVisible : function(panel, callback, scope, timeout) {
            this.waitFor(
                function() { return !!panel.getView().getNode(0) }, 
                callback,
                scope, 
                timeout
            );
        },

        /**
         * Utility method which returns the first grid row element.
         * 
         * @param {Ext.panel.Table} panel The panel
         * @return {Ext.Element} The element of first row of grid.
         */
        getFirstRow : function(grid) {
            var Ext = this.getExt();
            return Ext.get(grid.getView().getNode(0));
        },

        /**
         * Utility method which returns the first grid cell element.
         * 
         * @param {Ext.panel.Table} panel The panel
         * 
         * @return {HTMLElement} The element of first cell of grid.
         */
        getFirstCell : function(panel) {
            return this.getCell(panel, 0, 0);
        },

        /**
         * Utility method which returns a grid row element.
         * 
         * @param {Ext.panel.Table} panel The panel
         * @param {Int} index The row index
         */
        getRow : function(grid, index) {
            var Ext = this.global.Ext;
            return Ext.get(grid.getView().getNode(index));
        },

        /**
         * Utility method which returns the cell at the supplied row and col position.
         * 
         * @param {Ext.panel.Table} panel The panel
         * @param {Int} row The row index
         * @param {Int} column The column index
         * 
         * @return {HTMLElement} The element of the grid cell at specified position.
         */
        getCell : function(grid, row, col) {
            return grid.getView().getCellByPosition({ row : row, column : col });
        },

        /**
         * Utility method which returns the last cell for the supplied row.
         * 
         * @param {Ext.panel.Table} panel The panel
         * @param {Int} row The row index
         * 
         * @return {HTMLElement} The element of the grid cell at specified position.
         */
        getLastCellInRow : function(grid, row) {
            return grid.getView().getCellByPosition({ row : row, column : grid.headerCt.getColumnCount() - 1});
        },

        /**
         * This assertion passes if the passed string is found in the passed grid's cell element.
         * 
         * @param {Ext.panel.Table} panel The panel to query
         * @param {Int} row The row index
         * @param {Int} column The column index
         * @param {String/RegExp} string The string to find or RegExp to match
         * @param {Description} description The description for the assertion
         */
        matchGridCellContent : function(grid, rowIndex, colIndex, string, description) {
            var view = grid.getView(),
                cell = view.getCellByPosition({ row : rowIndex, column : colIndex }).child('div');

            var isRegExp    = this.typeOf(string) == 'RegExp';
            var content     = cell.dom.innerHTML;
                
            if (isRegExp && string.test(content) || content.match(string)) {
                this.pass(description);
            } else {
                this.fail(description, {
                    assertionName   : 'matchGridCellContent',
                    
                    got         : cell.dom.innerHTML,
                    gotDesc     : 'Cell content',
                    
                    need        : string,
                    needDesc    : 'String matching',
                    
                    annotation  : 'Row index: ' + rowIndex + ', column index: ' + colIndex
                });
            }
        }
    }
});
