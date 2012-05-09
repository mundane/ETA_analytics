StartTest(function(t) {
    t.diag('Combo field');
    
    t.testExtJS(
        {
            // do not reduce the `actionDelay` 
            actionDelay    : t.actionDelay
        },
        function (t) {
            
            var store = Ext.create('Ext.data.ArrayStore',{
                fields: ['text'],
                data: [
                    ['Form'],
                    ['Grid'],
                    ['Dirty']
                ]
            });
           
            var cmp = Ext.create('Ext.form.field.ComboBox',{
                fieldLabel      : 'Combo',
                allowBlank      : false,
                displayField    : 'text',
                editable        : true,
                forceSelection  : true,
                queryMode       : 'local',
                selectOnFocus   : true,
                store           : store,
                typeAhead       : true,
                valueField      : 'text',
                renderTo        : Ext.getBody()
            });
           
            t.pass('Rendered');
           
            t.chain(
                function (next) {
                    t.click(cmp, next)
                },
                function (next) {
                    //simulate tab key for auto-complete
                    t.type(cmp, 'Dir', next);
                },
                function (next) {
                    //simulate tab key for auto-complete
                    t.type(cmp, '[TAB]', next);
                },
                function () {
                    t.is(cmp.getValue(), 'Dirty', 'Correct value in field');
                }
            )
            
        }
    );
});