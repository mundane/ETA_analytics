StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    t.testExtJS(function (t) {
        var keys = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
            box = new Ext.form.TextField({
                width : 400,
                enableKeyEvents : true,
                renderTo : Ext.getBody()
            }),
            numberField = new Ext.form.NumberField({
                width : 100,
                enableKeyEvents : true,
                renderTo : Ext.getBody(),
                value : 0
            }),
            datePicker = new Ext.picker.Date({
                renderTo : Ext.getBody(),
                value : new Date(2011, 9, 5)
            }),
            rawLink = Ext.getBody().createChild({
                tag : 'a',
                html : 'testing link',
                href : '#',
                tabIndex : 1
            });
        rawLink.on('click', function(e, t) { 
            e.stopEvent(); 
        });

        function getDateCellFocusEl() { return datePicker.el.down('.' + datePicker.selectedCls + ' a'); }
        
        var nbrKeys = keys.length;

        t.willFireNTimes(box, 'keydown', nbrKeys, 'TextField');
        t.willFireNTimes(box, 'keyup', nbrKeys, 'TextField');
        t.willFireNTimes(box, 'keypress', nbrKeys, 'TextField');
        
        t.willFireNTimes(numberField, 'specialkey', 4, 'NumberField');
        t.willFireNTimes(datePicker, 'select', 2, 'DatePicker');

        t.willFireNTimes(rawLink, 'click', 2,  'Anchor tag');
       
        t.click(rawLink);
        t.keyPress(rawLink, 'ENTER');

        t.type(box.inputEl, keys, function() {
            t.is(box.getValue(), keys, "Correctly simulated normal character keys");

            t.type(numberField.inputEl, "[UP][UP][DOWN][UP]", function() {
                t.is(numberField.getValue(), 2, "Correctly simulated up/down arrow keys");
        
                t.click(getDateCellFocusEl());
                Ext.each(['[RIGHT]', '[RIGHT]', '[LEFT]', '[RIGHT]', '[ENTER]'], function(key) {
                    t.type(getDateCellFocusEl(), key);
                });
                
                t.isDateEqual(datePicker.getValue(), new Date(2011, 9, 7), "Correctly simulated LEFT/RIGHT/ENTER arrow keys");
                t.done();
            });
        });
    });
});
