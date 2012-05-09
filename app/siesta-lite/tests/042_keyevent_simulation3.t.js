StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    t.testExtJS(function (t) {
        var keys = ",;.-'",
            box = new Ext.form.TextField({
            width : 400,
            enableKeyEvents : true,
            renderTo : Ext.getBody()
        });
        
        t.willFireNTimes(box, 'keydown', keys.length, 'TextField');
        t.willFireNTimes(box, 'keypress', keys.length, 'TextField');
        t.willFireNTimes(box, 'keyup', keys.length, 'TextField');
        box.inputEl.focus();
        t.type(box.inputEl, keys, function() {
            t.is(box.getValue(), keys, "Correctly simulated keys");
            t.done();
        });
    });
});
