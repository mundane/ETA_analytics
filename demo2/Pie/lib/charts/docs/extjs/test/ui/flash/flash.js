/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial Software License Agreement provided with the Software or, alternatively, in accordance with the terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.require([
    'Ext.flash.Component',
    'Ext.window.Window'
]);

Ext.onReady(function() {

    Ext.widget('window', {
        title: 'Flash Component - resize me!',
        layout: 'fit',
        width: 300,
        height: 300,
        x: 20,
        y: 20,
        resizable: true,
        renderTo: Ext.getBody(),
        hidden: false,
        items: {
            xtype: 'flash',
            url: 'tiger.swf'
        }
    });

    Ext.widget('window', {
        title: 'With wmode=transparent - resize me!',
        layout: 'fit',
        width: 300,
        height: 300,
        x: 340,
        y: 20,
        resizable: true,
        renderTo: Ext.getBody(),
        hidden: false,
        items: {
            xtype: 'flash',
            url: 'tiger.swf',
            wmode: 'transparent'
        }
    });

});
