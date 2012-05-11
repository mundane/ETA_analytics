// @description Model representing the data to be handled
// @param id Id of the entity Must be present
// @param date Date of creation
// @param title Title of the data Must be present
// @param narrative The actual data

Ext.regModel('AnalyticsModel', {
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'date', type: 'date', dateFormat: 'c' },
        { name: 'title', type: 'string' },
        { name: 'narrative', type: 'string' }
    ],
    validations: [
        { type: 'presence', field: 'id' },
        { type: 'presence', field: 'title', message: 'Please enter a title for this note.' }
    ]
});

