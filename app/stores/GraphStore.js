
// @description Store containing graph model entities. This store is static and is not changed in the app.
Ext.regStore('GraphStore', {
    model: 'GraphModel',
	data: [
		{id: 1, title: 'Pie', icon: 'icons/pie.png', desc: 'Flowcharting gone wild'},
		{id: 2, title: 'Bar', icon: 'icons/bar.png', desc: 'Flowcharting gone wild'},
		{id: 3, title: 'Column', icon: 'icons/column.png', desc: 'Flowcharting gone wild'},
		{id: 4, title: 'Scatter', icon: 'icons/scatter.png', desc: 'Flowcharting gone wild'},
		{id: 5, title: 'Line', icon: 'icons/line.png', desc: 'Flowcharting gone wild'},
		{id: 6, title: 'Area', icon: 'icons/area.png', desc: 'Flowcharting gone wild'},
		{id: 7, title: 'Stock', icon: 'icons/stock.png', desc: 'Flowcharting gone wild'}
	],
	autoload: 'true'
});

AnalyticsApp.stores.graphStore = Ext.StoreMgr.get('GraphStore');

