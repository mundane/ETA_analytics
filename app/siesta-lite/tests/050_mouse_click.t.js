StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    t.testExtJS(function (t) {
        // plain simple clicks
        var clickDiv = Ext.getBody().createChild({
            tag     : 'div',
            html    : 'testing click'
        });
        t.willFireNTimes(clickDiv, 'mousedown', 1,  'DIV tag');
        t.willFireNTimes(clickDiv, 'mouseup', 1,  'DIV tag');
        t.willFireNTimes(clickDiv, 'click', 1,  'DIV tag');
        
        t.click(clickDiv);

        // plain simple clicks
        var rightClickDiv = Ext.getBody().createChild({
            tag     : 'div',
            html    : 'testing right click'
        });
        t.willFireNTimes(rightClickDiv, 'mousedown', 1,  'DIV tag');
        t.willFireNTimes(rightClickDiv, 'mouseup', 1,  'DIV tag');
        t.willFireNTimes(rightClickDiv, 'contextmenu', 1,  'DIV tag');
        
        t.rightClick(rightClickDiv);
        
        // plain simple clicks
        var doubleClickDiv = Ext.getBody().createChild({
            tag     : 'div',
            html    : 'testing double click'
        });
        t.willFireNTimes(doubleClickDiv, 'mousedown', 2,  'DIV tag');
        t.willFireNTimes(doubleClickDiv, 'mouseup', 2,  'DIV tag');
        t.willFireNTimes(doubleClickDiv, 'click', 2,  'DIV tag');
        t.willFireNTimes(doubleClickDiv, 'dblclick', 1,  'DIV tag');
        
        t.doubleClick(doubleClickDiv);
        
        // now clicking in the center of the outer (bigger) div
        // but the click should happen on the top-most element at that position in the DOM
        var div2 = Ext.getBody().createChild({
            tag     : 'div',
            style   : 'width : 100px; height : 100px; background: blue',
            
            children    : {
                tag     : 'div',
                style   : 'width : 50px; height : 50px; background: yellow; position : relative; top : 25px; left : 25px',
                html    : '&nbsp'
            }
        });
        
        var innerDiv    = div2.child('div')
        
        t.willFireNTimes(innerDiv, 'mousedown', 1,  'DIV tag');
        t.willFireNTimes(innerDiv, 'mouseup', 1,  'DIV tag');
        t.willFireNTimes(innerDiv, 'click', 1,  'DIV tag');
        
        t.click(div2);
        
        t.done();
    });
});

