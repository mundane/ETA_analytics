Ext.regController('AnalyticsGraphController', {

    'pie': function (options) {
        "use strict";
        AnalyticsApp.views.analyticsGridView.Canvas.update("");
        var generateData1 = function (n, floor) {
                var data = [],
                    p = (Math.random() * 11) + 1,
                    i;

                floor = (!floor && floor !== 0) ? 20 : floor;

                for (i = 0; i < (n || 12); i++) {
                    data.push({
                        name: Date.monthNames[i % 12],
                        2007: Math.floor(Math.max((Math.random() * 100), floor))
                    });
                }
                return data;
            };
        var store1 = new Ext.data.JsonStore({
            fields: ['name', '2007'],
            data: generateData1(6, 2)
        });

        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Pie Chart',
            width: 1200,
            height: 600,
            id: 'mychart',
            animate: true,
            store: store1,
            items: {
                cls: 'pie1',
                store: store1,
                theme: 'Demo',
                shadow: false,
                animate: true,
                insetPadding: 20,
                legend: {
                    position: {
                        portrait: 'bottom',
                        landscape: 'right'
                    }
                },
                interactions: [{
                    type: 'reset',
                    confirm: true
                }, {
                    type: 'rotate'
                }, {
                    type: 'iteminfo',
                    gesture: 'taphold',
                    listeners: {
                        show: function (interaction, item, panel) {
                            var storeItem = item.storeItem;
                            panel.update(['<ul><li><b>Month: </b>' + storeItem.get('name') + '</li>', '<li><b>Value: </b> ' + storeItem.get('2007') + '</li></ul>'].join(''));
                        }
                    }
                }, {
                    type: 'piegrouping',
                    //snapWhileDragging: true,
                    onSelectionChange: function (me, items) {
                        if (items.length) {
                            var sum = 0,
                                i = items.length;
                            while (i--) {
                                sum += items[i].storeItem.get('2007');
                            }
                            chartPanel.descriptionPanel.setTitle('Total: ' + sum);
                            chartPanel.headerPanel.setActiveItem(1, {
                                type: 'slide',
                                direction: 'left'
                            });
                        } else {
                            chartPanel.headerPanel.setActiveItem(0, {
                                type: 'slide',
                                direction: 'right'
                            });
                        }
                    }
                }],
                series: [{
                    type: 'pie',
                    field: '2007',
                    showInLegend: true,
                    highlight: false,
                    listeners: {
                        'labelOverflow': function (label, item) {
                            item.useCallout = true;
                        }
                    },
                    // Example to return as soon as styling arrives for callouts
                    callouts: {
                        renderer: function (callout, storeItem) {
                            callout.label.setAttributes({
                                text: storeItem.get('name')
                            }, true);
                        },
                        filter: function () {
                            return false;
                        },
                        box: {
                            //no config here.
                        },
                        lines: {
                            'stroke-width': 2,
                            offsetFromViz: 20
                        },
                        label: {
                            font: 'italic 14px Arial'
                        },
                        styles: {
                            font: '14px Arial'
                        }
                    },
                    label: {
                        field: 'name'
                    }
                }]
            }
        });
    },
    'bar': function (options) {
        "use strict";
        AnalyticsApp.views.analyticsGridView.Canvas.update("");
        var generateData2 = function (n, floor) {
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
        var store2 = new Ext.data.JsonStore({
            fields: ['name', '2008', '2009', '2010', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
            data: generateData2(5, 20)
        });
        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Bar Chart',
            width: 1200,
            height: 600,
            id: 'barchart',
            items: {
                cls: 'bar1',
                theme: 'Demo',
                animate: true,
                store: store2,
                shadow: false,
                legend: {
                    position: {
                        portrait: 'right',
                        landscape: 'top'
                    },
                    labelFont: '17px Arial'
                },
                interactions: [{
                    type: 'reset'
                }, {
                    type: 'togglestacked'
                }, {
                    type: 'panzoom',
                    axes: {
                        left: {}
                    }
                }, {
                    type: 'iteminfo',
                    gesture: 'taphold',
                    panel: {
                        dockedItems: [{
                            dock: 'top',
                            xtype: 'toolbar',
                            title: 'Details'
                        }],

                        html: 'Testing'
                    },
                    listeners: {
                        'show': function (me, item, panel) {
                            panel.update('<ul><li><b>Month:</b> ' + item.value[0] + '</li><li><b>Value: </b> ' + item.value[1] + '</li></ul>');
                        }
                    }
                }, {
                    type: 'itemcompare',
                    offset: {
                        x: -10
                    },
                    listeners: {
                        'show': function (interaction) {
                            var val1 = interaction.item1.value,
                                val2 = interaction.item2.value;

                            chartPanel.descriptionPanel.setTitle(val1[0] + ' to ' + val2[0] + ' : ' + Math.round((val2[1] - val1[1]) / val1[1] * 100) + '%');
                            chartPanel.headerPanel.setActiveItem(1, {
                                type: 'slide',
                                direction: 'left'
                            });
                        },
                        'hide': function () {
                            chartPanel.headerPanel.setActiveItem(0, {
                                type: 'slide',
                                direction: 'right'
                            });
                        }
                    }
                }],
                axes: [{
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ['2008', '2009', '2010'],
                    label: {
                        renderer: function (v) {
                            return v.toFixed(0);
                        }
                    },
                    title: 'Number of Hits',
                    minimum: 0
                }, {
                    type: 'Category',
                    position: 'left',
                    fields: ['name'],
                    title: 'Month of the Year'
                }],
                series: [{
                    type: 'bar',
                    xField: 'name',
                    yField: ['2008', '2009', '2010'],
                    axis: 'bottom',
                    highlight: true,
                    showInLegend: true
                }]
            }
        });
    },

    'column': function (options) {
        AnalyticsApp.views.analyticsGridView.Canvas.update("");
        var generateData3 = function (n, floor) {
                var data = [],
                    p = (Math.random() * 11) + 1,
                    i;

                floor = (!floor && floor !== 0) ? 20 : floor;

                for (i = 0; i < (n || 12); i++) {
                    data.push({
                        name: Date.monthNames[i % 12],
                        data1: Math.floor(Math.max((Math.random() * 100), floor)),
                        data2: Math.floor(Math.max((Math.random() * 100), floor)),
                        data3: Math.floor(Math.max((Math.random() * 100), floor)),
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
        var store3 = new Ext.data.JsonStore({
            fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
            data: generateData3(5, 20)
        });
        var colors = ['url(#v-1)', 'url(#v-2)', 'url(#v-3)', 'url(#v-4)', 'url(#v-5)'];

        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Column Chart',
            width: 1200,
            height: 600,
            id: 'columnchart',
            items: {
                cls: 'column1',
                animate: {
                    easing: 'bounceOut',
                    duration: 750
                },
                store: store3,
                shadow: false,
                gradients: [{
                    'id': 'v-1',
                    'angle': 0,
                    stops: {
                        0: {
                            color: 'rgb(212, 40, 40)'
                        },
                        100: {
                            color: 'rgb(117, 14, 14)'
                        }
                    }
                }, {
                    'id': 'v-2',
                    'angle': 0,
                    stops: {
                        0: {
                            color: 'rgb(180, 216, 42)'
                        },
                        100: {
                            color: 'rgb(94, 114, 13)'
                        }
                    }
                }, {
                    'id': 'v-3',
                    'angle': 0,
                    stops: {
                        0: {
                            color: 'rgb(43, 221, 115)'
                        },
                        100: {
                            color: 'rgb(14, 117, 56)'
                        }
                    }
                }, {
                    'id': 'v-4',
                    'angle': 0,
                    stops: {
                        0: {
                            color: 'rgb(45, 117, 226)'
                        },
                        100: {
                            color: 'rgb(14, 56, 117)'
                        }
                    }
                }, {
                    'id': 'v-5',
                    'angle': 0,
                    stops: {
                        0: {
                            color: 'rgb(187, 45, 222)'
                        },
                        100: {
                            color: 'rgb(85, 10, 103)'
                        }
                    }
                }],
                axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['data1'],
                    minimum: 0,
                    maximum: 100,
                    label: {
                        renderer: function (v) {
                            return v.toFixed(0);
                        }
                    },
                    title: 'Number of Hits'
                }, {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Month of the Year'
                }],
                series: [{
                    type: 'column',
                    axis: 'left',
                    highlight: true,
                    renderer: function (sprite, storeItem, barAttr, i, store) {
                        barAttr.fill = colors[i % colors.length];
                        return barAttr;
                    },
                    label: {
                        field: 'data1'
                    },
                    xField: 'name',
                    yField: 'data1'
                }],
                interactions: [{
                    type: 'panzoom',
                    axes: ['bottom']
                }]
            }
        });
    },
    'line': function (options) {
        AnalyticsApp.views.analyticsGridView.Canvas.update("");
		"use strict";
        var generateData4 = function (n, floor) {
                var data = [],
                    p = (Math.random() * 11) + 1,
                    i;

                floor = 10;

                for (i = 0; i < (n || 12); i++) {
                    data.push({
                        name: Date.monthNames[i % 12],
                        iphone: Math.floor(Math.max((Math.random() * 100), floor)),
                        android: Math.floor(Math.max((Math.random() * 100), floor)),
                        ipad: Math.floor(Math.max((Math.random() * 100), floor))
                    });
                }
                return data;
            };
        var store4 = new Ext.data.JsonStore({
            fields: ['name', 'iphone', 'android', 'ipad'],
            data: generateData4(5, 20)
        });

        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Line Chart',
            width: 1200,
            height: 600,
            id: 'linechart',
            items: {
                cls: 'line1',
                theme: 'Demo',
                store: store4,
                animate: true,
                shadow: true,
                legend: {
                    position: 'right'
                },
                interactions: [{
                    type: 'panzoom',
                    axes: {
                        left: {}
                    }
                }, {
                    type: 'iteminfo',
                    listeners: {
                        show: function (interaction, item, panel) {
                            var storeItem = item.storeItem;
                            panel.update(['<ul><li><b>Month: </b>' + storeItem.get('name') + '</li>', '<li><b>Value: </b> ' + item.value[1] + '</li></ul>'].join(''));
                        }
                    }
                }],
                axes: [{
                    type: 'Numeric',
                    minimum: 0,
                    maximum: 100,
                    position: 'left',
                    fields: ['iphone', 'android', 'ipad'],
                    title: 'Number of Hits',
                    minorTickSteps: 1
                }, {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Month of the Year'
                }],
                series: [{
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    fill: true,
                    smooth: true,
                    axis: 'left',
                    xField: 'name',
                    yField: 'iphone',
                    title: 'iPhone'
                }, {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    smooth: true,
                    xField: 'name',
                    yField: 'android',
                    title: 'Android'
                }, {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    smooth: true,
                    xField: 'name',
                    yField: 'ipad',
                    title: 'iPad'
                }]
            }
        });
    },
    'scatter': function (options) {
        AnalyticsApp.views.analyticsGridView.Canvas.update("");

        generateData5 = function (n, floor) {
            var data = [],
                p = (Math.random() * 11) + 1,
                i;

            floor = (!floor && floor !== 0) ? 20 : floor;

            for (i = 0; i < (n || 12); i++) {
                data.push({
                    name: Date.monthNames[i % 12],
                    data1: Math.floor(Math.max((Math.random() * 100), floor)),
                    data2: Math.floor(Math.max((Math.random() * 100), floor)),
                    data3: Math.floor(Math.max((Math.random() * 100), floor)),
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
        store5 = new Ext.data.JsonStore({
            fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
            data: generateData5(12, 20)
        });
        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Scatter Chart',
            width: 1200,
            height: 600,
            id: 'scatterchart',
            items: {
                cls: 'scatter1',
                theme: 'Demo',
                animate: false,
                // shadow: true,
                store: store5,
                axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['data1', 'data2', 'data3'],
                    title: 'Number of Hits'
                }, {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Month of the Year'
                }],
                series: [{
                    type: 'scatter',
                    markerConfig: {},
                    axis: 'left',
                    xField: 'name',
                    yField: 'data1'
                }, {
                    type: 'scatter',
                    markerConfig: {},
                    axis: 'left',
                    xField: 'name',
                    yField: 'data2'
                }, {
                    type: 'scatter',
                    markerConfig: {},
                    axis: 'left',
                    xField: 'name',
                    yField: 'data3'
                }]
            }
        });
    },

    'area': function (options) {
        AnalyticsApp.views.analyticsGridView.Canvas.update("");

        generateData6 = function (n, floor) {
			"use strict";
            var data = [],
                i;

            floor = (!floor && floor !== 0) ? 20 : floor;

            for (i = 0; i < (n || 12); i++) {
                data.push({
                    name: Date.monthNames[i % 12],
                    2003: Math.floor(Math.max((Math.random() * 100), floor)),
                    2004: Math.floor(Math.max((Math.random() * 100), floor)),
                    2005: Math.floor(Math.max((Math.random() * 100), floor)),
                    2006: Math.floor(Math.max((Math.random() * 100), floor)),
                    2007: Math.floor(Math.max((Math.random() * 100), floor)),
                    2008: Math.floor(Math.max((Math.random() * 100), floor)),
                    2009: Math.floor(Math.max((Math.random() * 100), floor))
                });
            }
            return data;
        };
        window.store6 = new Ext.data.JsonStore({
            fields: ['name', '2003', '2004', '2005', '2006', '2007', '2008', '2009'],
            data: generateData6(5, 20)
        });


        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Area Chart',
            width: 1200,
            height: 600,
            id: 'areachart',
            items: {
                cls: 'area1',
                theme: 'Demo',
                store: store6,
                animate: true,
                legend: {
                    position: {
                        portrait: 'bottom',
                        landscape: 'right'
                    },
                    labelFont: '20px Arial'
                },
                axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['2003', '2004', '2005', '2006', '2007', '2008', '2009'],
                    title: 'Number of Hits',
                    minimum: 0,
                    adjustMinimumByMajorUnit: 0
                }, {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Month of the Year'
                }],
                series: [{
                    type: 'area',
                    highlight: false,
                    axis: 'left',
                    xField: 'name',
                    yField: ['2003', '2004', '2005', '2006', '2007', '2008', '2009']
                }]
            }
        });
    },
    'stock': function (options) {
        AnalyticsApp.views.analyticsGridView.Canvas.update("");

        function generateData7() {
			"use strict";
            var today = new Date(),
                before = today.add(Date.DAY, -200),
                data = [{
                    date: before,
                    num: 0,
                    djia: 10000,
                    sp500: 1100
                }],
                i, currentDate = before;

            for (i = 1; i < 200; i++) {
                data.push({
                    date: (currentDate = currentDate.add(Date.DAY, 1)),
                    num: i,
                    sp500: data[i - 1].sp500 + ((Math.floor(Math.random() * 2) % 2) ? -1 : 1) * Math.floor(Math.random() * 7),
                    djia: data[i - 1].djia + ((Math.floor(Math.random() * 2) % 2) ? -1 : 1) * Math.floor(Math.random() * 7)
                });
            }
            return data;
        }

        var store7 = new Ext.data.JsonStore({
            fields: ['date', 'num', 'sp500', 'djia'],
            data: generateData7()
        });
        store7.loadData(generateData7());
        var chartPanel = new Ext.chart.Panel({
            renderTo: 'canvas',
            title: 'Stock Analysis',
            width: 1200,
            height: 600,
            id: 'stockchart',
            items: {
                cls: 'stock1',
                theme: 'Demo',
                legend: {
                    position: {
                        portrait: 'right',
                        landscape: 'top'
                    },
                    labelFont: '17px Arial'
                },
                interactions: [{
                    type: 'panzoom',
                    axes: {
                        left: {
                            maxZoom: 2
                        },
                        bottom: {
                            maxZoom: 4
                        },
                        right: {
                            minZoom: 0.5,
                            maxZoom: 4,
                            allowPan: false
                        }
                    }
                }],
                animate: false,
                store: store7,
                axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['djia'],
                    title: 'Dow Jones Average'
                }, {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['sp500'],
                    title: 'S&P 500'
                }, {
                    type: 'Time',
                    position: 'bottom',
                    fields: ['date'],
                    dateFormat: ' M d ',
                    label: {
                        rotate: {
                            degrees: 45
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    showMarkers: false,
                    smooth: true,
                    axis: 'left',
                    xField: 'date',
                    yField: 'djia'
                }, {
                    type: 'line',
                    showMarkers: false,
                    fill: true,
                    axis: 'right',
                    xField: 'date',
                    yField: 'sp500'
                }]
            }
        });
    }

});

AnalyticsApp.controllers.analyticsGraphController = Ext.ControllerManager.get('AnalyticsGraphController');
