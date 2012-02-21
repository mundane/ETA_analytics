Ext.setup({
    onReady: function(){
		this.tab = new Ext.TabPanel({
			fullscreen: true,
			dockedItems:[{xtype:'toolbar', title:'Drag & Drop'}]
		});
        // Create a new draggable for the div with an id
        var i = new Ext.util.Draggable('square', {revert: false}); // id of 'square'
        new Ext.util.Draggable('circle', {revert: false});
        new Ext.util.Draggable('rectangle', {
            group: 'rectangle',
            revert: false
        });  
		show_draggables();
    }
});
