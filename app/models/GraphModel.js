
// @description Model representing different graphing methods  
// @param id Id of the entity Must be present  
// @param title Title of the data Must be present  
// @param desc Describtion of the graph  

Ext.regModel('GraphModel', {
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'title', type: 'string' },
        { name: 'desc', type: 'string' }
    ],
    validations: [
        { type: 'presence', field: 'id' },
        { type: 'presence', field: 'title', message: 'Please enter a title for this note.' }
    ]
});

