StartTest(function(outerT) {
    
    outerT.needDone      = true
    
    outerT.testExtJS(function (t) {
        
        var view        = new Ext.view.View({
            renderTo        : Ext.getBody(),
            
            tpl             : new Ext.XTemplate('{foo}'),
            
            store           : new Ext.data.Store({
                fields      : [ 'foo' ],
                data        : []
            })
        })
        
        // testing that `waitForViewRendered` will handle the case with empty store
        // see: http://bryntum.com/forum/viewtopic.php?f=20&t=1742&p=10421&e=10421
        t.waitForViewRendered(view, function () {
            
            t.pass("Reached correct exit point")
            
            outerT.done()
        })
    });    
});