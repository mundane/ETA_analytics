/*
 * File: app/view/Mainview.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('ProjectFlow.view.Mainview', {
    extend: 'Ext.Panel',

    config: {
        layout: {
            type: 'card'
        },
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                id: 'Toolbar',
                items: [
                    {
                        xtype: 'button',
                        docked: 'right',
                        id: 'Info',
                        itemId: 'mybutton',
                        iconCls: 'info',
                        iconMask: true
                    }
                ]
            },
            {
                xtype: 'panel',
                docked: 'left',
                id: 'Sidebar',
                width: 70,
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'list',
                        id: 'Sidebarmenu',
                        itemTpl: [
                            '<div>List Item {string}</div>'
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                html: '<h1>Bottom Tabs</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light", though the standard type is dark. Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
                id: 'Canvas'
            }
        ],
        listeners: [
            {
                fn: 'onInfoTap',
                event: 'tap',
                delegate: '#Info'
            }
        ]
    },

    onInfoTap: function(button, e, options) {

        console.log('info clicked');
        generateData = function(n, floor) {
            var data = [],
                p = (Math.random() * 11) + 1,
                i;

            floor = (!floor && floor !== 0) ? 20 : floor;

            for (i = 0; i < (n || 12); i++) {
                data.push({
                    name: Date.monthNames[i % 12],
                    2008: Math.floor(Math.max((Math.random() * 100), floor)),
                    2009: Math.floor(Math.max((Math.random() * 100), floor)),
                    2010: Math.floor(Math.max((Math.random() * 100), floor)),
                    data4: Math.floor(Math.max((Math.random() * 100), floor)),
                    data5: Math.floor(Math.max((Math.random() * 100), floor)),
                    data6: Math.floor(Math.max((Math.random() * 100), floor)),
                    data7: Math.floor(Math.max((Math.random() * 100), floor)),
                    data8: Math.floor(Math.max((Math.random() * 100), floor)),
                    data9: Math.floor(Math.max((Math.random() * 100), floor))
                });
            }
            return data;
        };
        Ext.store1 = new Ext.data.JsonStore({
            data: generateData(5, 20)
        });

    }

});