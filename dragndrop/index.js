// Setup the Sencha Touch app.
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: true,
    onReady: function(){
		this.tab = new Ext.TabPanel({
			fullscreen: true,
			dockedItems:[{xtype:'toolbar', title:'Drag & Drop'}]
		});
        // Create a new draggable for the div with an
        // id of 'draggable'
        new Ext.util.Draggable('draggable', {
            revert: false
        });
        new Ext.util.Draggable('triang', {
            revert: false
        });


        // Create a new draggable for the div with an
        // id of 'invalid
        new Ext.util.Draggable('invalid', {
            // Specify a group that won't have a valid
            // Droppable target
            group: 'invalid',
            // Revert the Draggable back to its original
            // position on an invalid drop.
            revert: false
        });

        // Create a new Droppable for the div with an
        // id of 'droppable'
        new Ext.util.Droppable('droppable', {
            // Change the validDropMode from the default of 'intersect' to
            // 'contains' this ensures that a Draggable must be completed
            // contained by the Droppable in order to perform a drop
            validDropMode: 'contains',
            listeners: {
                drop: function(droppable, draggable, e) {
                    draggable.el.setHTML('Dropped!');
                }
            }
        });
    }
});