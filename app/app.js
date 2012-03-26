var App = new Ext.Application({
    name: 'NotesApp',
    useLoadMask: true,

    launch: function () {
        Ext.dispatch({
            controller: NotesApp.controllers.notesController,
            action: 'index'
        });
    }
});